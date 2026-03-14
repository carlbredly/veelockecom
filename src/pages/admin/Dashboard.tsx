import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, TrendingUp, Clock, CheckCircle, Package, ArrowRight, MessageCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAllOrders } from '../../lib/api';
import { Order, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../types';
import { format, subDays, isToday, isThisWeek, isThisMonth } from 'date-fns';

const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const todayOrders  = useMemo(() => orders.filter((o) => isToday(new Date(o.createdAt))), [orders]);
  const weekOrders   = useMemo(() => orders.filter((o) => isThisWeek(new Date(o.createdAt), { weekStartsOn: 1 })), [orders]);
  const monthOrders  = useMemo(() => orders.filter((o) => isThisMonth(new Date(o.createdAt))), [orders]);
  const monthRevenue = useMemo(() => monthOrders.reduce((s, o) => s + o.total, 0), [monthOrders]);

  const chartData = useMemo(() => Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dayOrders = orders.filter((o) => format(new Date(o.createdAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
    return { date: format(date, 'MM/dd'), orders: dayOrders.length, revenue: dayOrders.reduce((s, o) => s + o.total, 0) };
  }), [orders]);

  const recentOrders = orders.slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-gray-100 rounded w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 bg-gray-100 rounded-2xl" />)}
        </div>
        <div className="h-64 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-light text-gray-900">Dashboard</h1>
        <p className="text-gray-400 mt-1 text-sm">Welcome back! Here's your business overview.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { icon: <ShoppingBag className="w-5 h-5 text-rose-500" />, bg: 'bg-rose-50', label: 'This Month', value: monthOrders.length, sub: `${weekOrders.length} this week`, suffix: 'orders' },
          { icon: <TrendingUp className="w-5 h-5 text-amber-500" />, bg: 'bg-amber-50', label: 'Monthly Revenue', value: `${monthRevenue.toLocaleString('en')}`, sub: `${todayOrders.length} order(s) today`, suffix: 'FCFA' },
          { icon: <Clock className="w-5 h-5 text-orange-500" />, bg: 'bg-orange-50', label: 'Awaiting Payment', value: orders.filter((o) => o.status === 'PENDING').length, sub: 'Needs verification', suffix: '', urgent: orders.filter((o) => o.status === 'PENDING').length > 0 },
          { icon: <CheckCircle className="w-5 h-5 text-green-500" />, bg: 'bg-green-50', label: 'Delivered', value: orders.filter((o) => o.status === 'DELIVERED').length, sub: 'All time', suffix: 'orders' },
        ].map(({ icon, bg, label, value, sub, suffix, urgent }) => (
          <div key={label} className={`bg-white rounded-2xl p-5 border ${urgent ? 'border-orange-200' : 'border-gray-100'} shadow-sm`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>{icon}</div>
              {urgent && <span className="text-xs bg-orange-100 text-orange-600 font-semibold px-2 py-0.5 rounded-full">Urgent</span>}
            </div>
            <p className="text-2xl font-bold text-gray-900">{value} <span className="text-sm font-normal text-gray-400">{suffix}</span></p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-light text-gray-900">Orders — Last 30 Days</h2>
          <Link to="/admin/orders" className="text-xs text-rose-500 font-semibold flex items-center gap-1 hover:text-rose-700">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <div style={{ minWidth: 380 }}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9CA3AF' }} interval={6} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #f3f4f6', fontSize: 12 }} formatter={(v) => [v, 'Orders']} />
                <Line type="monotone" dataKey="orders" stroke="#F43F6E" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-display text-2xl font-light text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs text-rose-500 font-semibold flex items-center gap-1 hover:text-rose-700">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Order #', 'Customer', 'Amount', 'Status', 'Date', ''].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4"><span className="font-mono text-sm font-semibold text-gray-800">{order.orderNumber}</span></td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-800">{order.customer.name}</p>
                    <p className="text-xs text-gray-400">{order.customer.phone}</p>
                  </td>
                  <td className="px-5 py-4"><span className="font-semibold text-sm text-gray-900">{order.total.toLocaleString('en')} <span className="text-xs font-normal text-gray-400">FCFA</span></span></td>
                  <td className="px-5 py-4"><span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${ORDER_STATUS_COLORS[order.status]}`}>{ORDER_STATUS_LABELS[order.status]}</span></td>
                  <td className="px-5 py-4"><span className="text-xs text-gray-400">{format(new Date(order.createdAt), 'MMM d, yyyy')}</span></td>
                  <td className="px-5 py-4">
                    <a href={`https://wa.me/${order.customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${order.customer.name.split(' ')[0]} 🌸\nRegarding your Vee Locs order N°${order.orderNumber}...`)}`}
                      target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700">
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Awaiting Payment', count: orders.filter((o) => o.status === 'PENDING').length, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-100' },
          { label: 'Payment Received', count: orders.filter((o) => o.status === 'PAYMENT_RECEIVED').length, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
          { label: 'Being Prepared',   count: orders.filter((o) => o.status === 'PROCESSING').length, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
        ].map(({ label, count, color, bg }) => (
          <div key={label} className={`${bg} border rounded-2xl p-5 flex items-center justify-between`}>
            <div>
              <p className="text-sm text-gray-600">{label}</p>
              <p className={`text-3xl font-bold ${color} mt-1`}>{count}</p>
            </div>
            <Package className={`w-8 h-8 ${color} opacity-30`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
