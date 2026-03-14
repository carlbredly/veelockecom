import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MessageCircle, ShoppingBag, ArrowLeft, CheckCircle, Copy } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../lib/api';
import { generateOrderNumber, SHOP_WHATSAPP, SHOP_NAME } from '../data/products';
import toast from 'react-hot-toast';

const checkoutSchema = z.object({
  name: z.string().min(3, 'Full name required (min. 3 characters)'),
  phone: z.string().min(8, 'Invalid phone number'),
  address: z.string().min(5, 'Address required (min. 5 characters)'),
  city: z.string().min(2, 'City required'),
  paymentMethod: z.string().min(1, 'Please select a payment method'),
  notes: z.string().optional(),
});
type CheckoutFormData = z.infer<typeof checkoutSchema>;

const PAYMENT_METHODS = [
  { name: 'Wave', number: '0700 00 00 00' },
  { name: 'Orange Money', number: '0700 00 00 00' },
  { name: 'MTN Money', number: '0700 00 00 00' },
  { name: 'CinetPay', number: 'Via payment link' },
];

const Checkout: React.FC = () => {
  const { state, clearCart } = useCart();
  const navigate = useNavigate();
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('Wave');

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: 'Wave' },
  });

  const watchedName = watch('name', '');
  const watchedPhone = watch('phone', '');
  const watchedAddress = watch('address', '');
  const watchedCity = watch('city', '');

  if (state.items.length === 0 && !orderConfirmed) {
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center px-4">
        <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
        <h2 className="font-display text-3xl text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6 text-sm">Add products before placing an order</p>
        <Link to="/shop" className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-rose-600 transition-colors">
          Go to Shop
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    const num = generateOrderNumber();
    try {
      await createOrder({
        orderNumber: num,
        customer: {
          name: data.name,
          phone: data.phone,
          address: data.address,
          city: data.city,
        },
        items: state.items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          variantSize: item.variant.size,
          variantPrice: item.variant.price,
          quantity: item.quantity,
        })),
        total: state.total,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
      });
      setOrderNumber(num);
      clearCart();
      setOrderConfirmed(true);
      toast.success('Order placed successfully!', { icon: '🎉' });
    } catch {
      toast.error('Failed to place order. Please try again.');
    }
  };

  const generateWhatsAppMsg = () => {
    const items = state.items.map((i) => `• ${i.product.name} (${i.variant.size}) ×${i.quantity} = ${(i.variant.price * i.quantity).toLocaleString('en')} FCFA`).join('\n');
    return encodeURIComponent(
      `Hi ${SHOP_NAME} 👋\n\n🛍 NEW ORDER — ${orderNumber || 'Pending'}\n\n` +
      `👤 Name: ${watchedName || 'N/A'}\n📱 Phone: ${watchedPhone || 'N/A'}\n📍 Address: ${watchedAddress}, ${watchedCity}\n\n` +
      `📦 Items:\n${items}\n\n💰 Total: ${state.total.toLocaleString('en')} FCFA\n💳 Payment: ${selectedPayment}\n\n` +
      `[Please attach your payment screenshot]`
    );
  };

  if (orderConfirmed) {
    const link = `https://wa.me/${SHOP_WHATSAPP.replace(/\D/g, '')}?text=${generateWhatsAppMsg()}`;
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-6 sm:p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="font-display text-4xl font-light text-gray-900 mb-2">Order Placed!</h2>
          <p className="text-gray-500 text-sm mb-8">Your order has been saved to Supabase.</p>
          <div className="bg-gray-50 rounded-2xl p-5 mb-6">
            <p className="text-xs text-gray-400 mb-1.5">Your order number</p>
            <div className="flex items-center justify-center gap-2">
              <span className="font-display text-3xl font-semibold text-rose-600">{orderNumber}</span>
              <button onClick={() => { navigator.clipboard.writeText(orderNumber); toast.success('Copied!'); }} className="text-gray-400 hover:text-gray-700">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Keep this number to track your order</p>
          </div>
          <div className="space-y-3">
            <a href={link} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl transition-colors text-sm">
              <MessageCircle className="w-5 h-5" />
              Confirm & Send Payment Proof on WhatsApp
            </a>
            <Link to={`/track-order?number=${orderNumber}`}
              className="flex items-center justify-center gap-2 w-full border-2 border-gray-200 text-gray-700 font-semibold py-4 rounded-xl hover:border-rose-400 hover:text-rose-600 transition-all text-sm">
              Track My Order
            </Link>
            <Link to="/" className="block text-gray-400 hover:text-gray-600 text-sm py-2">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        <Link to="/shop" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm mb-7 sm:mb-10 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Continue Shopping
        </Link>
        <h1 className="font-display text-4xl sm:text-5xl font-light text-gray-900 mb-7 sm:mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100">
                <h2 className="font-display text-xl sm:text-2xl font-light text-gray-900 mb-5 sm:mb-6">Your Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Full Name *</label>
                    <input {...register('name')} placeholder="e.g. Aminata Koné"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-100" />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Phone (WhatsApp) *</label>
                    <input {...register('phone')} placeholder="+225 07 00 00 00 00"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-100" />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">City *</label>
                    <input {...register('city')} placeholder="e.g. Abidjan"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-100" />
                    {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Delivery Address *</label>
                    <input {...register('address')} placeholder="Neighborhood, street, number..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-100" />
                    {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Notes (optional)</label>
                    <textarea {...register('notes')} rows={2} placeholder="Delivery instructions..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-900 focus:outline-none resize-none" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100">
                <h2 className="font-display text-xl sm:text-2xl font-light text-gray-900 mb-5 sm:mb-6">Payment Method</h2>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {PAYMENT_METHODS.map((m) => (
                    <label key={m.name} onClick={() => setSelectedPayment(m.name)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPayment === m.name ? 'border-gray-900 bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}>
                      <input type="radio" {...register('paymentMethod')} value={m.name} className="text-gray-900" />
                      <div>
                        <p className="font-semibold text-sm text-gray-800">{m.name}</p>
                        <p className="text-xs text-gray-400">{m.number}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-amber-800 mb-2">📋 How it works:</p>
                  <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
                    <li>Select your payment method above</li>
                    <li>Send the exact amount to the number shown</li>
                    <li>Click "Place Order" below</li>
                    <li>Send your payment screenshot via WhatsApp</li>
                  </ol>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-rose-600 text-white font-bold py-5 rounded-2xl transition-all text-sm tracking-wide disabled:opacity-50">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving order...
                  </span>
                ) : (
                  <><MessageCircle className="w-5 h-5" />Place Order</>
                )}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 sticky top-24">
              <h2 className="font-display text-xl sm:text-2xl font-light text-gray-900 mb-4 sm:mb-5">Order Summary</h2>
              <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
                {state.items.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-rose-50 shrink-0">
                      <img src={item.product.images[0]} alt="" className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.product.name}</p>
                      <p className="text-xs text-gray-400">{item.variant.size} · ×{item.quantity}</p>
                      <p className="text-sm font-semibold text-gray-900">{(item.variant.price * item.quantity).toLocaleString('en')} FCFA</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span><span>{state.total.toLocaleString('en')} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-3 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-rose-600">{state.total.toLocaleString('en')} FCFA</span>
                </div>
              </div>
              <div className="mt-4 bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400">Payment via</p>
                <p className="font-semibold text-gray-800 text-sm mt-0.5">{selectedPayment}</p>
                <p className="text-xs text-gray-400">{PAYMENT_METHODS.find((m) => m.name === selectedPayment)?.number}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
