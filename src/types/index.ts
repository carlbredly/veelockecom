export type OrderStatus =
  | 'PENDING'
  | 'PAYMENT_RECEIVED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface ProductVariant {
  size: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  ingredients: string[];
  variants: ProductVariant[];
  images: string[];
  hairTypes: string[];
  isActive: boolean;
  stock: number;
  category: string;
  featured: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  email?: string;
  createdAt: Date;
}

export interface OrderItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface StatusChange {
  status: OrderStatus;
  changedAt: Date;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  statusHistory: StatusChange[];
  createdAt: Date;
  notes?: string;
  paymentMethod?: string;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CLIENT';
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar?: string;
  date?: Date;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Awaiting Payment',
  PAYMENT_RECEIVED: 'Payment Received',
  PROCESSING: 'Being Prepared',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAYMENT_RECEIVED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-orange-100 text-orange-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};
