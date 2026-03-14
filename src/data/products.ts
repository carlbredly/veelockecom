import { Product, Order, Customer, Testimonial } from '../types';

// Shop contact info — update with your real numbers
export const SHOP_WHATSAPP = '+2250000000000';
export const SHOP_PHONE = '+225 00 00 00 00';
export const SHOP_NAME = 'Vee Locs Organic';

// Real product image
const OIL_IMG = '/oil.png';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Vee Locs Original Hair Oil',
    shortDescription: 'Our signature blend for radiant, deeply hydrated hair.',
    description:
      'Vee Locs Original Hair Oil is an exclusive blend of hand-picked African natural oils. Enriched with Vitamin E and essential fatty acids, it nourishes from within, strengthens the hair shaft, and delivers an unmatched luminous shine. Perfect for locs, braids, natural hair, and all afro textures.',
    ingredients: [
      'Jamaican Black Castor Oil',
      'Moroccan Argan Oil',
      'Jojoba Oil',
      'Vitamin E',
      'Lavender Essential Oil',
      'Rosemary Extract',
    ],
    variants: [
      { size: '100ml', price: 4500 },
      { size: '200ml', price: 7500 },
      { size: '500ml', price: 15000 },
    ],
    images: [OIL_IMG, OIL_IMG],
    hairTypes: ['Locs', 'Natural', 'Braids', 'Relaxed'],
    isActive: true,
    stock: 42,
    category: 'oil',
    featured: true,
  },
  {
    id: 'prod-002',
    name: 'Growth & Anti-Breakage Oil',
    shortDescription: 'Stimulates growth and reduces breakage by up to 80%.',
    description:
      'Specially formulated for fragile hair and slow growth, this powerful oil combines the finest natural actives to stimulate scalp circulation and promote fast, healthy hair growth.',
    ingredients: [
      'Jamaican Black Castor Oil',
      'Cayenne Pepper Oil',
      'Peppermint Essential Oil',
      'Virgin Coconut Oil',
      'Bamboo Extract (Silica)',
      'Plant-based Biotin',
    ],
    variants: [
      { size: '100ml', price: 5500 },
      { size: '200ml', price: 9500 },
    ],
    images: [OIL_IMG, OIL_IMG],
    hairTypes: ['All Types', 'Fragile Hair', 'Slow Growth'],
    isActive: true,
    stock: 28,
    category: 'growth',
    featured: true,
  },
  {
    id: 'prod-003',
    name: 'Scalp & Roots Treatment Oil',
    shortDescription: 'Eliminates dandruff and soothes irritated scalp.',
    description:
      'A soothing and purifying formula dedicated to scalp care. Rich in natural antifungal and anti-inflammatory actives, it effectively combats dandruff, itching, and irritation while rebalancing the scalp microbiome.',
    ingredients: [
      'Tea Tree Oil',
      'Neem Oil',
      'Black Seed Oil (Habba Sawda)',
      'Pure Aloe Vera',
      'Eucalyptus Essential Oil',
      'Plant Probiotic Extract',
    ],
    variants: [
      { size: '100ml', price: 5000 },
      { size: '200ml', price: 8500 },
    ],
    images: [OIL_IMG, OIL_IMG],
    hairTypes: ['All Types', 'Dry Scalp', 'Dandruff'],
    isActive: true,
    stock: 15,
    category: 'scalp',
    featured: true,
  },
  {
    id: 'prod-004',
    name: 'Shine & Ends Revival Oil',
    shortDescription: 'Glosses lengths and repairs split ends instantly.',
    description:
      'This lightweight, non-greasy oil is the ideal solution to transform your lengths and repair split ends. Its serum-like texture applies effortlessly and never weighs hair down. Result: smooth, luminous, ultra-moisturised hair.',
    ingredients: [
      'Golden Sesame Oil',
      'Marula Oil',
      'Vegetable Silk Serum',
      'Rosehip Oil',
      'Vitamin E & F',
      'Moringa Extract',
    ],
    variants: [
      { size: '50ml', price: 3500 },
      { size: '100ml', price: 6000 },
    ],
    images: [OIL_IMG, OIL_IMG],
    hairTypes: ['Long', 'Straight', 'Relaxed', 'All Types'],
    isActive: true,
    stock: 35,
    category: 'shine',
    featured: false,
  },
  {
    id: 'prod-005',
    name: 'Vee Locs Complete Trio',
    shortDescription: 'The winning trio for a complete hair care routine.',
    description:
      'The Vee Locs Complete Trio brings together our 3 best-sellers in an elegant gift box. Ideal as a gift or to start a complete natural hair care routine: scalp cleansing, active growth, and shine. Exceptional value.',
    ingredients: [
      'Vee Locs Original Oil (100ml)',
      'Growth & Anti-Breakage Oil (100ml)',
      'Scalp & Roots Treatment Oil (100ml)',
    ],
    variants: [
      { size: 'Trio 3 × 100ml', price: 12000 },
    ],
    images: [OIL_IMG, OIL_IMG],
    hairTypes: ['All Types'],
    isActive: true,
    stock: 10,
    category: 'bundle',
    featured: true,
  },
];

const DEMO_CUSTOMERS: Customer[] = [
  {
    id: 'cust-001',
    name: 'Aminata Koné',
    phone: '+2250701234567',
    address: '14 Rue des Fleurs, Cocody',
    city: 'Abidjan',
    email: 'aminata@example.com',
    createdAt: new Date('2024-11-10'),
  },
  {
    id: 'cust-002',
    name: 'Fatou Diallo',
    phone: '+2250702345678',
    address: '7 Boulevard de la Paix, Plateau',
    city: 'Abidjan',
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 'cust-003',
    name: 'Marie-Claire Bamba',
    phone: '+2250703456789',
    address: '22 Résidentiel, Yopougon',
    city: 'Abidjan',
    createdAt: new Date('2025-01-15'),
  },
  {
    id: 'cust-004',
    name: 'Rokhaya Seck',
    phone: '+2210774567890',
    address: '5 Rue Thiong',
    city: 'Dakar',
    createdAt: new Date('2025-02-03'),
  },
];

export const DEMO_ORDERS: Order[] = [
  {
    id: 'order-001',
    orderNumber: 'VLO-2025-0001',
    customer: DEMO_CUSTOMERS[0],
    items: [{ product: PRODUCTS[0], variant: { size: '200ml', price: 7500 }, quantity: 2 }],
    total: 15000,
    status: 'DELIVERED',
    statusHistory: [
      { status: 'PENDING', changedAt: new Date('2025-01-10T09:00:00') },
      { status: 'PAYMENT_RECEIVED', changedAt: new Date('2025-01-10T10:30:00') },
      { status: 'PROCESSING', changedAt: new Date('2025-01-11T08:00:00') },
      { status: 'SHIPPED', changedAt: new Date('2025-01-12T14:00:00') },
      { status: 'DELIVERED', changedAt: new Date('2025-01-13T16:00:00') },
    ],
    createdAt: new Date('2025-01-10'),
    paymentMethod: 'Wave',
  },
  {
    id: 'order-002',
    orderNumber: 'VLO-2025-0002',
    customer: DEMO_CUSTOMERS[1],
    items: [{ product: PRODUCTS[1], variant: { size: '100ml', price: 5500 }, quantity: 1 }],
    total: 5500,
    status: 'PROCESSING',
    statusHistory: [
      { status: 'PENDING', changedAt: new Date('2025-02-01T11:00:00') },
      { status: 'PAYMENT_RECEIVED', changedAt: new Date('2025-02-01T12:00:00') },
      { status: 'PROCESSING', changedAt: new Date('2025-02-02T09:00:00') },
    ],
    createdAt: new Date('2025-02-01'),
    paymentMethod: 'Orange Money',
  },
  {
    id: 'order-003',
    orderNumber: 'VLO-2025-0003',
    customer: DEMO_CUSTOMERS[2],
    items: [{ product: PRODUCTS[4], variant: { size: 'Trio 3 × 100ml', price: 12000 }, quantity: 1 }],
    total: 12000,
    status: 'PENDING',
    statusHistory: [{ status: 'PENDING', changedAt: new Date('2025-03-10T15:00:00') }],
    createdAt: new Date('2025-03-10'),
    paymentMethod: 'MTN Money',
  },
  {
    id: 'order-004',
    orderNumber: 'VLO-2025-0004',
    customer: DEMO_CUSTOMERS[3],
    items: [
      { product: PRODUCTS[2], variant: { size: '200ml', price: 8500 }, quantity: 1 },
      { product: PRODUCTS[3], variant: { size: '100ml', price: 6000 }, quantity: 1 },
    ],
    total: 14500,
    status: 'SHIPPED',
    statusHistory: [
      { status: 'PENDING', changedAt: new Date('2025-03-08T10:00:00') },
      { status: 'PAYMENT_RECEIVED', changedAt: new Date('2025-03-08T11:00:00') },
      { status: 'PROCESSING', changedAt: new Date('2025-03-09T09:00:00') },
      { status: 'SHIPPED', changedAt: new Date('2025-03-11T14:00:00') },
    ],
    createdAt: new Date('2025-03-08'),
    paymentMethod: 'CinetPay',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-001',
    name: 'Aminata K.',
    location: 'Abidjan, CI',
    rating: 5,
    comment:
      "I've been using Vee Locs Original for 3 months and my locs are incredibly shiny and hydrated! The scent is divine and a little goes a very long way. I now order the 500ml bottle because I'm completely obsessed!",
    date: new Date('2025-01-20'),
  },
  {
    id: 'test-002',
    name: 'Fatou D.',
    location: 'Dakar, SN',
    rating: 5,
    comment:
      "The Growth Oil has truly been a game changer for me. In just 2 months, I noticed a real difference. My hair grows faster and breaks so much less. 100% natural — you can feel it!",
    date: new Date('2025-02-10'),
  },
  {
    id: 'test-003',
    name: 'Marie-Claire B.',
    location: 'Cocody, CI',
    rating: 5,
    comment:
      "The Complete Trio is the perfect gift! I got it for my sister and she's obsessed. The WhatsApp service is great, delivery was super fast. Thank you Vee Locs!",
    date: new Date('2025-03-05'),
  },
  {
    id: 'test-004',
    name: 'Rokhaya S.',
    location: 'Dakar, SN',
    rating: 4,
    comment:
      "The Scalp Oil finally fixed my dandruff issues that I'd had for years. No more irritation, no more itching. I recommend it to every woman dealing with these problems.",
    date: new Date('2025-03-12'),
  },
];

export const generateOrderNumber = (): string => {
  const year = new Date().getFullYear();
  const orders = JSON.parse(localStorage.getItem('vlo_orders') || '[]') as Order[];
  const nextNum = (orders.length + 1).toString().padStart(4, '0');
  return `VLO-${year}-${nextNum}`;
};
