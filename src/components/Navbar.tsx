import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Leaf, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();

  // Hero section is dark, so navbar starts transparent white text
  const isHeroPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsMenuOpen(false); }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/track-order', label: 'Track Order' },
  ];

  const isDark = isHeroPage && !isScrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? ' backdrop-blur-md shadow-sm '
          : isHeroPage
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-rose-300/50 transition-shadow">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div className="leading-tight">
              <span className={`block font-display text-xl font-semibold transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Vee Locs
              </span>
              <span className="block text-[9px] text-amber-500 font-semibold tracking-[0.25em] -mt-0.5">
                ORGANIC
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm font-medium tracking-wide transition-colors relative group ${
                  location.pathname === to
                    ? isDark ? 'text-white' : 'text-rose-600'
                    : isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
                <span className={`absolute -bottom-0.5 left-0 h-0.5 bg-rose-500 rounded-full transition-all duration-300 ${location.pathname === to ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              to="/checkout"
              className={`relative p-2 transition-colors ${isDark ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-rose-500'}`}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold leading-none">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth — desktop */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="text-xs font-semibold tracking-wide bg-rose-500 text-white px-4 py-2 rounded-full hover:bg-rose-600 transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <span className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                    {user?.name.split(' ')[0]}
                  </span>
                  <button
                    onClick={logout}
                    className={`p-1.5 transition-colors ${isDark ? 'text-white/50 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <User className="w-4 h-4" />
                    Sign In
                  </Link>
                  <Link
                    to="/login#register"
                    onClick={() => {}}
                    state={{ mode: 'register' }}
                    className="text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white px-3.5 py-1.5 rounded-full transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 transition-colors ${isDark ? 'text-white' : 'text-gray-700'}`}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl animate-scale-in">
          <div className="px-4 sm:px-6 py-4 space-y-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`block py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === to
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-2 mt-2">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" className="block py-3 px-4 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50">
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={logout} className="block w-full text-left py-3 px-4 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block py-3 px-4 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Sign In
                  </Link>
                  <Link to="/login" state={{ mode: 'register' }} className="block py-3 px-4 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50">
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
