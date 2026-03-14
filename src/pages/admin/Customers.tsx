import React, { useMemo, useState, useEffect } from 'react';
import { Search, MessageCircle, User, X, ShoppingBag, Calendar, MapPin } from 'lucide-react';
import { Order, Customer, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../types';
import { getAllCustomers, getCustomerOrders } from '../../lib/api';
import { format } from 'date-fns';

interface CustomerStats {
  customer: Customer;
  orderCount: number;
  totalSpent: number;
  lastOrderDate?: Date;
}

interface SelectedCustomer extends CustomerStats {
  orders: Order[];
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<SelectedCustomer | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    getAllCustomers()
      .then((data) => setCustomers(data.map((c) => ({
        customer: { id: c.id, name: c.name, phone: c.phone, address: c.address, city: c.city, createdAt: c.createdAt },
        orderCount: c.orderCount,
        totalSpent: c.totalSpent,
        lastOrderDate: c.lastOrderDate,
      }))))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (stat: CustomerStats) => {
    setLoadingOrders(true);
    const orders = await getCustomerOrders(stat.customer.id).catch(() => []);
    setSelected({ ...stat, orders });
    setLoadingOrders(false);
  };

  const filtered = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter(({ customer }) =>
      customer.name.toLowerCase().includes(q) || customer.phone.includes(q) || (customer.city || '').toLowerCase().includes(q)
    );
  }, [customers, search]);

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
        <h1 className="font-display text-4xl font-light text-gray-900">Customers</h1>
        <p className="text-gray-400 mt-1 text-sm">{customers.length} registered customers</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, phone, city..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-gray-900 focus:outline-none text-sm" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Customer', 'Phone', 'City', 'Orders', 'Total Spent', 'Last Order', ''].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">No customers found</td></tr>
              ) : filtered.map(({ customer, orderCount, totalSpent, lastOrderDate }) => (
                <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-rose-500" />
                      </div>
                      <span className="font-medium text-sm text-gray-800">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4"><span className="text-sm text-gray-600">{customer.phone}</span></td>
                  <td className="px-4 py-4"><span className="text-sm text-gray-400">{customer.city}</span></td>
                  <td className="px-4 py-4"><span className="font-semibold text-gray-800">{orderCount}</span></td>
                  <td className="px-4 py-4"><span className="font-bold text-gray-900 text-sm">{totalSpent.toLocaleString('en')} <span className="text-xs font-normal text-gray-400">FCFA</span></span></td>
                  <td className="px-4 py-4"><span className="text-xs text-gray-400">{lastOrderDate ? format(lastOrderDate, 'MMM d, yyyy') : '—'}</span></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleSelect({ customer, orderCount, totalSpent, lastOrderDate })} className="text-rose-500 hover:text-rose-700 text-xs font-medium">View</button>
                      <a href={`https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${customer.name.split(' ')[0]} 🌸\nVee Locs Organic is reaching out...`)}`}
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

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end" onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-gray-900">Customer Profile</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
                  <User className="w-7 h-7 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-semibold text-gray-900">{selected.customer.name}</h3>
                  <p className="text-gray-500 text-sm">{selected.customer.phone}</p>
                </div>
              </div>
                <div className="grid grid-cols-2 gap-3">
                <div className="bg-rose-50 rounded-2xl p-4 text-center">
                  <ShoppingBag className="w-5 h-5 text-rose-400 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-gray-900">{selected.orderCount}</p>
                  <p className="text-xs text-gray-500">Orders</p>
                </div>
                <div className="bg-amber-50 rounded-2xl p-4 text-center">
                  <span className="text-amber-400 font-bold text-lg block">₣</span>
                  <p className="text-lg font-bold text-gray-900">{selected.totalSpent.toLocaleString('en')}</p>
                  <p className="text-xs text-gray-500">FCFA spent</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">Address</p>
                    <p className="text-sm font-medium text-gray-700">{selected.customer.address}</p>
                    <p className="text-xs text-gray-400">{selected.customer.city}</p>
                  </div>
                </div>
                {selected.lastOrderDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400">Last Order</p>
                      <p className="text-sm font-medium text-gray-700">{format(selected.lastOrderDate, 'MMMM d, yyyy')}</p>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Order History</h4>
                {loadingOrders && <div className="h-16 bg-gray-100 rounded-xl animate-pulse" />}
                {!loadingOrders && selected.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((order) => (
                  <div key={order.id} className="bg-white border border-gray-100 rounded-xl p-4 mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-sm font-semibold text-gray-800">{order.orderNumber}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${ORDER_STATUS_COLORS[order.status]}`}>{ORDER_STATUS_LABELS[order.status]}</span>
                    </div>
                    <p className="text-xs text-gray-400">{format(new Date(order.createdAt), 'MMM d, yyyy')} · <span className="font-semibold text-gray-700">{order.total.toLocaleString('en')} FCFA</span></p>
                    <p className="text-xs text-gray-400 mt-1">{order.items.map((i) => `${i.product.name} ×${i.quantity}`).join(', ')}</p>
                  </div>
                ))}
              </div>
              <a href={`https://wa.me/${selected.customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${selected.customer.name.split(' ')[0]} 🌸\nVee Locs Organic is reaching out...`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                <MessageCircle className="w-4 h-4" />Contact on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
