import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Instagram, Facebook, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import { SHOP_WHATSAPP } from '../data/products';

const Footer: React.FC = () => {
  const whatsappLink = `https://wa.me/${SHOP_WHATSAPP.replace(/\D/g, '')}`;

  return (
    <footer className="bg-[#0C0A0E] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-12 sm:pt-16 pb-8 sm:pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10 lg:mb-14">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="w-9 h-9 bg-rose-500/20 rounded-full flex items-center justify-center">
                <Leaf className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <span className="block font-display text-xl font-semibold text-white">Vee Locs</span>
                <span className="block text-[9px] text-amber-500 tracking-[0.25em] -mt-0.5">ORGANIC</span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 font-light">
              Premium natural hair oils formulated with love for all afro hair types. Because your hair deserves the very best nature has to offer.
            </p>
            <div className="flex gap-3">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-green-500/15 hover:bg-green-500/30 rounded-full flex items-center justify-center transition-colors">
                <MessageCircle className="w-4 h-4 text-green-400" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4 text-gray-400" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4 text-gray-400" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-500 mb-5">Navigate</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/shop', label: 'Shop' },
                { to: '/track-order', label: 'Track Order' },
                { to: '/login', label: 'My Account' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-gray-500 hover:text-white text-sm transition-colors font-light">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-500 mb-5">Our Oils</h4>
            <ul className="space-y-3">
              {['Original Hair Oil', 'Growth Oil', 'Scalp Treatment', 'Shine & Ends Oil', 'Complete Trio'].map((item) => (
                <li key={item}>
                  <Link to="/shop" className="text-gray-500 hover:text-white text-sm transition-colors font-light">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-500 mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MessageCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white text-sm transition-colors font-light">
                  WhatsApp: {SHOP_WHATSAPP}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <a href="mailto:contact@veelocs.com" className="text-gray-500 hover:text-white text-sm transition-colors font-light">
                  contact@veelocs.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <span className="text-gray-500 text-sm font-light">+225 00 00 00 00</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <span className="text-gray-500 text-sm font-light">St. Pertersburg, Russie</span>
              </li>
            </ul>
            <div className="mt-5">
              <p className="text-[10px] text-gray-600 mb-2 font-medium tracking-wide uppercase">Accepted Payments</p>
              <div className="flex flex-wrap gap-2">
                {['Sber', 'Tinkoff', 'VTB', 'SPB'].map((m) => (
                  <span key={m} className="text-[10px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-gray-400">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
          <p className="text-gray-600 text-xs font-light">
            © {new Date().getFullYear()} Vee Locs Organic Hair Oil. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs font-light">
            Crafted with love for natural hair 🌿
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
