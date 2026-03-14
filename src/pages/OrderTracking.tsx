import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, MessageCircle, Phone, MapPin, Calendar } from 'lucide-react';
import OrderTracker from '../components/OrderTracker';
import { Order, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../types';
import { findOrder, getAllOrders } from '../lib/api';
import { SHOP_WHATSAPP } from '../data/products';
import { format } from 'date-fns';

const OrderTracking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('number') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const num = searchParams.get('number');
    if (num) { setQuery(num); runSearch(num); }
    else {
      // Charger les 3 dernières commandes comme exemples
      getAllOrders().then((all) => setRecentOrders(all.slice(0, 3))).catch(() => {});
    }
  }, []);

  const runSearch = (q?: string) => {
    const sq = (q || query).trim();
    if (!sq) return;
    setLoading(true);
    setSearched(true);
    findOrder(sq)
      .then(setOrder)
      .finally(() => setLoading(false));
  };

  const waLink = order
    ? `https://wa.me/${SHOP_WHATSAPP.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi Vee Locs 👋\nI'm reaching out about my order N°${order.orderNumber}`)}`
    : '#';

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0C0A0E] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(244,63,110,0.15),transparent_70%)]" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <Package className="w-9 h-9 sm:w-10 sm:h-10 mx-auto mb-4 text-rose-400" />
          <span className="text-xs text-amber-500 font-semibold tracking-[0.25em] uppercase block mb-3">Delivery Status</span>
          <h1 className="font-display text-4xl sm:text-5xl font-light mb-3">Track Your Order</h1>
          <p className="text-gray-400 font-light text-sm sm:text-base">Enter your order number or phone number to check your delivery status.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Search */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 mb-5 sm:mb-8 shadow-sm">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
            Order Number or Phone
          </label>
          <div className="flex gap-3">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runSearch()}
              placeholder="VLO-2025-0001 or +225..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-100" />
            <button onClick={() => runSearch()} disabled={loading || !query.trim()}
              className="flex items-center gap-2 bg-gray-900 hover:bg-rose-600 disabled:bg-gray-300 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm">
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Search className="w-4 h-4" />}
              Search
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Enter the order number you received at checkout</p>
        </div>

        {/* Results */}
        {searched && !loading && (
          <>
            {order ? (
              <div className="space-y-5 animate-fade-in">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
                    <div>
                      <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">Order</p>
                      <h2 className="font-display text-3xl font-semibold text-gray-900">{order.orderNumber}</h2>
                    </div>
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${ORDER_STATUS_COLORS[order.status]}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6 pb-5 sm:pb-6 border-b border-gray-100">
                    {[
                      { icon: <Phone className="w-4 h-4 text-rose-400" />, label: 'Customer', val: order.customer.name, sub: order.customer.phone },
                      { icon: <MapPin className="w-4 h-4 text-rose-400" />, label: 'Delivery', val: order.customer.address, sub: order.customer.city },
                      { icon: <Calendar className="w-4 h-4 text-rose-400" />, label: 'Order Date', val: format(new Date(order.createdAt), 'MMMM d, yyyy'), sub: undefined },
                      { icon: <span className="text-amber-500 font-bold text-sm">₣</span>, label: 'Total', val: `${order.total.toLocaleString('en')} FCFA`, sub: order.paymentMethod ? `via ${order.paymentMethod}` : undefined },
                    ].map(({ icon, label, val, sub }) => (
                      <div key={label} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">{icon}</div>
                        <div>
                          <p className="text-xs text-gray-400">{label}</p>
                          <p className="text-sm font-semibold text-gray-800">{val}</p>
                          {sub && <p className="text-xs text-gray-400">{sub}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mb-5 sm:mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Items Ordered</h3>
                    <div className="space-y-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                          <img src={item.product.images?.[0] || '/oil.png'} alt="" className="w-12 h-12 rounded-lg object-contain bg-white p-1" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{item.product.name}</p>
                            <p className="text-xs text-gray-400">{item.variant.size} · ×{item.quantity}</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">{(item.variant.price * item.quantity).toLocaleString('en')} FCFA</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <a href={waLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                    <MessageCircle className="w-4 h-4" />
                    Contact Vee Locs on WhatsApp
                  </a>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">
                  <h3 className="font-display text-xl sm:text-2xl font-light text-gray-900 mb-5 sm:mb-6">Delivery Timeline</h3>
                  <OrderTracker order={order} />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12 text-center shadow-sm">
                <Package className="w-14 h-14 text-gray-200 mx-auto mb-4" />
                <h3 className="font-display text-2xl text-gray-700 mb-2">Order Not Found</h3>
                <p className="text-gray-400 text-sm mb-6">No order found for "{query}".<br />Please check the number or contact us.</p>
                <a href={`https://wa.me/${SHOP_WHATSAPP.replace(/\D/g, '')}?text=${encodeURIComponent('Hi Vee Locs 👋\nI\'m trying to track my order but can\'t find it. Can you help?')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-green-600 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Contact Support
                </a>
              </div>
            )}
          </>
        )}

        {/* Recent orders hint */}
        {!searched && recentOrders.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Recent Orders</h3>
            <div className="space-y-2">
              {recentOrders.map((o) => (
                <button key={o.id} onClick={() => { setQuery(o.orderNumber); runSearch(o.orderNumber); }}
                  className="w-full flex items-center justify-between bg-gray-50 hover:bg-rose-50 rounded-xl px-4 py-3 text-left transition-colors">
                  <div>
                    <p className="font-mono font-semibold text-sm text-gray-800">{o.orderNumber}</p>
                    <p className="text-xs text-gray-400">{o.customer.name}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${ORDER_STATUS_COLORS[o.status]}`}>
                    {ORDER_STATUS_LABELS[o.status]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
