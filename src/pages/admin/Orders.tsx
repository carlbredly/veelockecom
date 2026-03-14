import React, { useState, useMemo, useEffect } from 'react';
import { Search, MessageCircle, ChevronDown, X, FileText, Clock } from 'lucide-react';
import { Order, OrderStatus, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../types';
import { getAllOrders as fetchAllOrders, updateOrderStatus, saveOrderNote } from '../../lib/api';
import { format } from 'date-fns';
import OrderTracker from '../../components/OrderTracker';
import toast from 'react-hot-toast';

const NEXT_STATUSES: Partial<Record<OrderStatus, OrderStatus[]>> = {
  PENDING: ['PAYMENT_RECEIVED', 'CANCELLED'],
  PAYMENT_RECEIVED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'CANCELLED'],
};

const STATUS_NOTIFICATION: Record<OrderStatus, string> = {
  PENDING: 'Your order has been received and is awaiting confirmation.',
  PAYMENT_RECEIVED: 'Your payment has been received and verified! 🎉 We are now preparing your order.',
  PROCESSING: 'Your order is being prepared. 📦',
  SHIPPED: 'Your order is on its way! 🚚 You should receive it very soon.',
  DELIVERED: 'Your order has been delivered! ✅ Thank you for your trust. We hope you love your Vee Locs 🌸',
  CANCELLED: 'Your order has been cancelled. Please contact us for more information.',
};

const STATUS_FILTERS = [
  { value: 'ALL', label: 'All' },
  { value: 'PENDING', label: 'Awaiting Payment' },
  { value: 'PAYMENT_RECEIVED', label: 'Payment Received' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchAllOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => orders.filter((o) => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    const q = search.toLowerCase();
    return !q || o.orderNumber.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || o.customer.phone.includes(q);
  }), [orders, search, statusFilter]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(id, status);
      const update = (o: Order) => o.id !== id ? o : { ...o, status, statusHistory: [...o.statusHistory, { status, changedAt: new Date() }] };
      setOrders((prev) => prev.map(update));
      setSelectedOrder((prev) => prev?.id === id ? update(prev) : prev);
      toast.success(`Status updated: ${ORDER_STATUS_LABELS[status]}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleSaveNote = async () => {
    if (!selectedOrder) return;
    try {
      await saveOrderNote(selectedOrder.id, newNote);
      setOrders((prev) => prev.map((o) => o.id === selectedOrder.id ? { ...o, notes: newNote } : o));
      setSelectedOrder((prev) => prev ? { ...prev, notes: newNote } : null);
      toast.success('Note saved');
    } catch {
      toast.error('Failed to save note');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-100 rounded w-36" />
        <div className="h-12 bg-gray-100 rounded-xl" />
        <div className="h-64 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-light text-gray-900">Orders</h1>
        <p className="text-gray-400 mt-1 text-sm">{orders.length} total orders</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by order #, name, phone..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none bg-white text-sm" />
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map(({ value, label }) => (
            <button key={value} onClick={() => setStatusFilter(value)}
              className={`text-xs px-3 py-2 rounded-xl font-medium transition-colors ${statusFilter === value ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
              {label} ({orders.filter((o) => value === 'ALL' || o.status === value).length})
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Order #', 'Customer', 'Items', 'Amount', 'Date', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">No orders found</td></tr>
              ) : filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4"><span className="font-mono text-sm font-semibold text-gray-800">{order.orderNumber}</span></td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-gray-800">{order.customer.name}</p>
                    <p className="text-xs text-gray-400">{order.customer.phone}</p>
                  </td>
                  <td className="px-4 py-4"><p className="text-xs text-gray-500 max-w-[140px] truncate">{order.items.map((i) => `${i.product.name} ×${i.quantity}`).join(', ')}</p></td>
                  <td className="px-4 py-4"><span className="font-semibold text-sm text-gray-900">{order.total.toLocaleString('en')} <span className="text-xs text-gray-400">FCFA</span></span></td>
                  <td className="px-4 py-4"><span className="text-xs text-gray-400">{format(new Date(order.createdAt), 'MMM d, yy')}</span></td>
                  <td className="px-4 py-4"><span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${ORDER_STATUS_COLORS[order.status]}`}>{ORDER_STATUS_LABELS[order.status]}</span></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setSelectedOrder(order); setNewNote(order.notes || ''); }}
                        className="text-rose-500 hover:text-rose-700 text-xs font-medium flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" /> Details
                      </button>
                      <a href={`https://wa.me/${order.customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${order.customer.name.split(' ')[0]} 🌸\n\nYour Vee Locs order N°${order.orderNumber} is now: ${ORDER_STATUS_LABELS[order.status]}\n\n${STATUS_NOTIFICATION[order.status]}\n\nThank you 💗 — Vee Locs Organic`)}`}
                        target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700">
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail panel */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end" onClick={(e) => e.target === e.currentTarget && setSelectedOrder(null)}>
          <div className="bg-white w-full max-w-xl h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold text-gray-900">{selectedOrder.orderNumber}</h2>
                <p className="text-xs text-gray-400">Order Details</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Current Status</p>
                <span className={`text-sm px-3 py-1.5 rounded-full font-semibold ${ORDER_STATUS_COLORS[selectedOrder.status]}`}>
                  {ORDER_STATUS_LABELS[selectedOrder.status]}
                </span>
              </div>
              {NEXT_STATUSES[selectedOrder.status] && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Change Status</p>
                  <div className="flex flex-wrap gap-2">
                    {NEXT_STATUSES[selectedOrder.status]!.map((s) => (
                      <button key={s} onClick={() => updateStatus(selectedOrder.id, s)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all ${s === 'CANCELLED' ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' : 'bg-gray-900 text-white hover:bg-rose-600'}`}>
                        <ChevronDown className="w-3 h-3" />{ORDER_STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Customer Info</p>
                <div className="space-y-2 text-sm">
                  {[['Name', selectedOrder.customer.name], ['Phone', selectedOrder.customer.phone], ['Address', selectedOrder.customer.address], ['City', selectedOrder.customer.city]].map(([l, v]) => (
                    <div key={l} className="flex justify-between">
                      <span className="text-gray-400">{l}</span>
                      <span className="font-medium text-gray-800 text-right max-w-[60%]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Items</p>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex gap-3 bg-white border border-gray-100 rounded-xl p-3 mb-2">
                    <img src={item.product.images[0]} alt="" className="w-10 h-10 rounded-lg object-contain bg-rose-50 p-1" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-800">{item.product.name}</p>
                      <p className="text-xs text-gray-400">{item.variant.size} · ×{item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-900">{(item.variant.price * item.quantity).toLocaleString('en')} FCFA</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-gray-100 text-sm font-bold">
                  <span>Total</span><span>{selectedOrder.total.toLocaleString('en')} FCFA</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> History
                </p>
                {[...selectedOrder.statusHistory].reverse().map((h, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs mb-2">
                    <span className="w-1 h-1 bg-rose-400 rounded-full mt-1.5 shrink-0" />
                    <div>
                      <span className="font-medium text-gray-700">{ORDER_STATUS_LABELS[h.status]}</span>
                      <span className="text-gray-400 ml-2">{format(new Date(h.changedAt), 'MMM d, yyyy HH:mm')}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Delivery Timeline</p>
                <OrderTracker order={selectedOrder} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Internal Notes</p>
                <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} rows={3} placeholder="Add an internal note..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-900 focus:outline-none resize-none" />
                <button onClick={handleSaveNote} className="mt-1 text-xs font-medium text-rose-500 hover:text-rose-700">
                  Save note
                </button>
              </div>
              <a href={`https://wa.me/${selectedOrder.customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${selectedOrder.customer.name.split(' ')[0]} 🌸\n\nYour Vee Locs order N°${selectedOrder.orderNumber} is now: ${ORDER_STATUS_LABELS[selectedOrder.status]}\n\n${STATUS_NOTIFICATION[selectedOrder.status]}\n\nThank you 💗 — Vee Locs Organic`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                <MessageCircle className="w-4 h-4" />
                Notify Customer on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
