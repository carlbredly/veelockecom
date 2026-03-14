import React, { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, Users, Menu, Leaf, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/customers', label: 'Customers', icon: Users },
];

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0C0A0E]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/login" replace />;

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-[#0C0A0E] border-r border-white/5">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-rose-500/20 rounded-full flex items-center justify-center">
            <Leaf className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <span className="block font-display text-base font-semibold text-white">Vee Locs</span>
            <span className="block text-[8px] text-amber-500 tracking-[0.2em] -mt-0.5">ORGANIC · ADMIN</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => {
          const active = isActive(to, exact);
          return (
            <Link key={to} to={to} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                active ? 'bg-white/10 text-white' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
              }`}>
              <Icon className={`w-4 h-4 ${active ? 'text-rose-400' : ''}`} />
              <span className="text-sm font-medium">{label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-rose-400" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-2">
          <div className="w-8 h-8 bg-rose-500/20 rounded-full flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-rose-400">{user?.name.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <button onClick={logout} className="text-gray-600 hover:text-red-400 transition-colors shrink-0" title="Sign Out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <Link to="/" className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-400 transition-colors px-3">
          ← View Store
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col h-screen sticky top-0">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-60 shadow-2xl">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center justify-between bg-white border-b border-gray-100 px-4 py-3 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display font-semibold text-gray-900 text-base">Admin</span>
          <button onClick={logout} className="text-gray-400 hover:text-red-500">
            <LogOut className="w-4 h-4" />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-5 sm:p-7 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
