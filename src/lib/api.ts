import { supabase } from './supabase';
import { Product, Order, Customer, Testimonial, OrderStatus, ProductVariant } from '../types';

// ─────────────────────────────────────────────────────────────
// Helpers — mapper les lignes Supabase vers les types TS
// ─────────────────────────────────────────────────────────────

function mapProduct(row: Record<string, unknown>, variants: Record<string, unknown>[]): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    shortDescription: row.short_description as string,
    description: row.description as string,
    category: row.category as string,
    ingredients: (row.ingredients as string[]) || [],
    hairTypes: (row.hair_types as string[]) || [],
    images: (row.images as string[]) || ['/oil.png'],
    isActive: row.is_active as boolean,
    featured: row.featured as boolean,
    stock: row.stock as number,
    variants: variants.map((v) => ({
      id: v.id as string,
      size: v.size as string,
      price: v.price as number,
    })) as ProductVariant[],
  };
}

function mapOrder(
  row: Record<string, unknown>,
  customer: Record<string, unknown>,
  items: Record<string, unknown>[],
  history: Record<string, unknown>[]
): Order {
  return {
    id: row.id as string,
    orderNumber: row.order_number as string,
    customer: {
      id: customer.id as string,
      name: customer.name as string,
      phone: customer.phone as string,
      address: customer.address as string,
      city: customer.city as string,
      createdAt: new Date(customer.created_at as string),
    } as Customer,
    items: items.map((i) => ({
      product: {
        id: (i.product_id as string) || '',
        name: i.product_name as string,
        images: ['/oil.png'],
        variants: [{ size: i.variant_size as string, price: i.variant_price as number }],
      } as Product,
      variant: { size: i.variant_size as string, price: i.variant_price as number } as ProductVariant,
      quantity: i.quantity as number,
    })),
    total: row.total as number,
    status: row.status as OrderStatus,
    statusHistory: history.map((h) => ({
      status: h.status as OrderStatus,
      changedAt: new Date(h.changed_at as string),
      note: h.note as string | undefined,
    })),
    createdAt: new Date(row.created_at as string),
    notes: row.notes as string | undefined,
    paymentMethod: row.payment_method as string | undefined,
  };
}

// ─────────────────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (products || []).map((p) => mapProduct(p, p.product_variants || []));
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return mapProduct(data, data.product_variants || []);
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []).map((p) => mapProduct(p, p.product_variants || []));
}

export async function upsertProduct(product: Partial<Product> & { id?: string }): Promise<Product> {
  const payload = {
    name: product.name,
    short_description: product.shortDescription,
    description: product.description,
    category: product.category,
    ingredients: product.ingredients,
    hair_types: product.hairTypes,
    images: product.images,
    is_active: product.isActive,
    featured: product.featured,
    stock: product.stock,
  };

  let productId = product.id;

  if (productId) {
    const { error } = await supabase.from('products').update(payload).eq('id', productId);
    if (error) throw error;
    await supabase.from('product_variants').delete().eq('product_id', productId);
  } else {
    const { data, error } = await supabase.from('products').insert(payload).select().single();
    if (error) throw error;
    productId = data.id;
  }

  if (product.variants && productId) {
    const variantRows = product.variants.map((v) => ({
      product_id: productId,
      size: v.size,
      price: v.price,
    }));
    const { error } = await supabase.from('product_variants').insert(variantRows);
    if (error) throw error;
  }

  return (await getProduct(productId!))!;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────────────

interface CreateOrderPayload {
  customer: Omit<Customer, 'id' | 'createdAt'>;
  items: { productId: string; productName: string; variantSize: string; variantPrice: number; quantity: number }[];
  total: number;
  paymentMethod: string;
  notes?: string;
  orderNumber: string;
}

export async function createOrder(payload: CreateOrderPayload): Promise<string> {
  // 1 — Insérer ou retrouver le customer
  let customerId: string;
  const { data: existingCustomer } = await supabase
    .from('customers')
    .select('id')
    .eq('phone', payload.customer.phone)
    .maybeSingle();

  if (existingCustomer) {
    customerId = existingCustomer.id;
  } else {
    const { data: newCustomer, error: custError } = await supabase
      .from('customers')
      .insert({
        name: payload.customer.name,
        phone: payload.customer.phone,
        address: payload.customer.address,
        city: payload.customer.city,
      })
      .select()
      .single();
    if (custError) throw custError;
    customerId = newCustomer.id;
  }

  // 2 — Insérer la commande
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: payload.orderNumber,
      customer_id: customerId,
      total: payload.total,
      status: 'PENDING',
      payment_method: payload.paymentMethod,
      notes: payload.notes,
    })
    .select()
    .single();
  if (orderError) throw orderError;

  // 3 — Insérer les articles
  const itemRows = payload.items.map((i) => ({
    order_id: order.id,
    product_id: i.productId || null,
    product_name: i.productName,
    variant_size: i.variantSize,
    variant_price: i.variantPrice,
    quantity: i.quantity,
  }));
  const { error: itemsError } = await supabase.from('order_items').insert(itemRows);
  if (itemsError) throw itemsError;

  // 4 — Premier statut dans l'historique
  await supabase.from('status_history').insert({
    order_id: order.id,
    status: 'PENDING',
  });

  return payload.orderNumber;
}

export async function findOrder(query: string): Promise<Order | null> {
  const q = query.trim().toLowerCase();

  // Chercher par numéro de commande
  const { data: byNumber } = await supabase
    .from('orders')
    .select('*, customers(*), order_items(*), status_history(*)')
    .ilike('order_number', q)
    .maybeSingle();

  if (byNumber) {
    return mapOrder(byNumber, byNumber.customers, byNumber.order_items, byNumber.status_history);
  }

  // Chercher par téléphone client
  const cleanPhone = q.replace(/\D/g, '');
  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .ilike('phone', `%${cleanPhone}%`)
    .maybeSingle();

  if (customer) {
    const { data: byPhone } = await supabase
      .from('orders')
      .select('*, customers(*), order_items(*), status_history(*)')
      .eq('customer_id', customer.id)
      .order('created_at', { ascending: false })
      .maybeSingle();

    if (byPhone) {
      return mapOrder(byPhone, byPhone.customers, byPhone.order_items, byPhone.status_history);
    }
  }

  return null;
}

export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, customers(*), order_items(*), status_history(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map((o) => mapOrder(o, o.customers, o.order_items, o.status_history));
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  note?: string
): Promise<void> {
  const { error: updateError } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);
  if (updateError) throw updateError;

  const { error: histError } = await supabase.from('status_history').insert({
    order_id: orderId,
    status,
    note,
  });
  if (histError) throw histError;
}

export async function saveOrderNote(orderId: string, notes: string): Promise<void> {
  const { error } = await supabase.from('orders').update({ notes }).eq('id', orderId);
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────
// CUSTOMERS
// ─────────────────────────────────────────────────────────────

export async function getAllCustomers(): Promise<(Customer & { orderCount: number; totalSpent: number; lastOrderDate?: Date })[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*, orders(total, created_at)')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((c) => {
    const orders = (c.orders as { total: number; created_at: string }[]) || [];
    const sorted = [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return {
      id: c.id,
      name: c.name,
      phone: c.phone,
      address: c.address,
      city: c.city,
      createdAt: new Date(c.created_at),
      orderCount: orders.length,
      totalSpent: orders.reduce((s, o) => s + Number(o.total), 0),
      lastOrderDate: sorted[0] ? new Date(sorted[0].created_at) : undefined,
    };
  });
}

export async function getCustomerOrders(customerId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, customers(*), order_items(*), status_history(*)')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map((o) => mapOrder(o, o.customers, o.order_items, o.status_history));
}

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []).map((t) => ({
    id: t.id,
    name: t.name,
    location: t.location,
    comment: t.comment,
    rating: t.rating,
  }));
}
