import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { SHOP_WHATSAPP, SHOP_NAME } from '../data/products';

const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const message = encodeURIComponent(
    `Hi ${SHOP_NAME} 👋\nI'd love to learn more about your hair oil products.`
  );
  const link = `https://wa.me/${SHOP_WHATSAPP.replace(/\D/g, '')}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3">
      {/* Tooltip card */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl p-4 w-72 border border-gray-100 animate-scale-in">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Vee Locs Organic</p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  Online now
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 mt-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 mb-3">
            <p className="text-sm text-gray-600 leading-relaxed">
              Hello! 🌸 Need help choosing the right oil for your hair type? We're here to guide you!
            </p>
          </div>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
          >
            Start Conversation
          </a>
        </div>
      )}

      {/* Main button */}
      <div className="relative">
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute -top-1 -left-1 w-5 h-5 bg-gray-400 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors z-10"
        >
          <X className="w-2.5 h-2.5" />
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-green-500/30 transition-all hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-25" />
        </button>
      </div>
    </div>
  );
};

export default WhatsAppButton;
