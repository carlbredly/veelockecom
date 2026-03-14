import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ShoppingBag, Star, Leaf, CheckCircle, MessageCircle,
  ChevronLeft, ChevronRight, Package, Droplets, Shield,
} from 'lucide-react';
import { getProduct } from '../lib/api';
import { SHOP_WHATSAPP, SHOP_NAME } from '../data/products';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import toast from 'react-hot-toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProduct(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-rose-300 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center">
        <Package className="w-16 h-16 text-gray-200 mb-4" />
        <h2 className="font-display text-2xl text-gray-700 mb-2">Product Not Found</h2>
        <Link to="/shop" className="text-rose-500 hover:underline text-sm">← Back to Shop</Link>
      </div>
    );
  }

  const selectedVariant = product.variants[selectedVariantIndex];
  const total = selectedVariant.price * quantity;

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
    toast.success(`${product.name} added to cart!`, {
      style: { background: '#fff', color: '#1a1a1a', border: '1px solid #f3f4f6', borderRadius: '12px' },
    });
  };

  const handleOrderNow = () => {
    addItem(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  const whatsappMessage = encodeURIComponent(
    `Hi ${SHOP_NAME} 👋\nI'd like to order:\n- Product: ${product.name}\n- Size: ${selectedVariant.size}\n- Qty: ${quantity}\n- Amount: ${total.toLocaleString('en')} FCFA\n\nI've made my payment, here's the proof:`
  );
  const whatsappLink = `https://wa.me/${SHOP_WHATSAPP.replace(/\D/g, '')}?text=${whatsappMessage}`;

  return (
    <div className="pt-16 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm mb-7 sm:mb-10 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Gallery */}
          <div>
            <div className="relative bg-gradient-to-br from-rose-50 to-amber-50 rounded-3xl overflow-hidden aspect-square mb-4">
              <img src={product.images[activeImageIndex] || '/oil.png'} alt={product.name}
                className="w-full h-full object-contain p-10" />
              {product.images.length > 1 && (
                <>
                  <button onClick={() => setActiveImageIndex((i) => i === 0 ? product.images.length - 1 : i - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => setActiveImageIndex((i) => i === product.images.length - 1 ? 0 : i + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImageIndex(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === activeImageIndex ? 'border-rose-500' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-contain bg-rose-50 p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs text-gray-400 ml-1.5">(47 reviews)</span>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                product.stock > 10 ? 'bg-green-100 text-green-700' :
                product.stock > 0  ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            <span className="text-xs text-rose-500 font-semibold tracking-[0.15em] uppercase mb-2 block">{product.category}</span>
            <h1 className="font-display text-4xl lg:text-5xl font-light text-gray-900 mb-4 leading-tight">{product.name}</h1>
            <p className="text-gray-500 leading-relaxed mb-6 font-light text-base">{product.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {product.hairTypes.map((type) => (
                <span key={type} className="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-3 py-1 rounded-full">{type}</span>
              ))}
            </div>

            {/* Size */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Size: <span className="text-rose-600 font-medium">{selectedVariant.size}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v, i) => (
                  <button key={i} onClick={() => setSelectedVariantIndex(i)}
                    className={`px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      i === selectedVariantIndex ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-700 hover:border-gray-400'
                    }`}>
                    {v.size}
                    <span className="block text-xs mt-0.5 font-semibold opacity-80">{v.price.toLocaleString('en')} FCFA</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-sm font-semibold text-gray-700 mb-3">Quantity</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-full border border-gray-200 hover:border-gray-400 flex items-center justify-center text-gray-600 transition-colors">−</button>
                <span className="w-10 text-center font-semibold text-lg">{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-9 h-9 rounded-full border border-gray-200 hover:border-gray-400 flex items-center justify-center text-gray-600 transition-colors">+</button>
              </div>
            </div>

            {/* Total */}
            <div className="bg-gray-50 rounded-2xl px-5 py-4 mb-6 flex items-center justify-between">
              <span className="text-gray-600 text-sm font-medium">Total</span>
              <span className="font-display text-3xl font-semibold text-gray-900">
                {total.toLocaleString('en')} <span className="text-base font-normal text-gray-500">FCFA</span>
              </span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mb-8">
              <button onClick={handleAddToCart} disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-semibold py-4 rounded-xl transition-all disabled:border-gray-200 disabled:text-gray-300 text-sm">
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>
              <button onClick={handleOrderNow} disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-4 rounded-xl transition-all disabled:bg-gray-200 text-sm">
                Order Now
              </button>
            </div>

            {/* Payment */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
              <h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4" /> Payment Instructions
              </h3>
              <div className="space-y-2 mb-4">
                {[
                  { method: 'Wave', number: '0700 00 00 00' },
                  { method: 'Orange Money', number: '0700 00 00 00' },
                  { method: 'MTN Money', number: '0700 00 00 00' },
                  { method: 'CinetPay', number: 'Via payment link' },
                ].map(({ method, number }) => (
                  <div key={method} className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{method}</span>
                    <span className="text-gray-500">{number}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-emerald-700 mb-3">
                Exact amount: <strong>{total.toLocaleString('en')} FCFA</strong>
              </p>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                <MessageCircle className="w-4 h-4" />
                I've Paid — Send Proof on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="mt-12 sm:mt-16 border-t border-gray-100 pt-10 sm:pt-14">
          <div className="max-w-3xl mb-6 sm:mb-8">
            <span className="text-xs text-amber-600 font-semibold tracking-[0.2em] uppercase">What's Inside</span>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-gray-900 mt-2">Natural Ingredients</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {product.ingredients.map((ingredient) => (
              <div key={ingredient} className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                  <Leaf className="w-3.5 h-3.5 text-green-500" />
                </div>
                <span className="text-sm font-medium text-gray-700">{ingredient}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How to use */}
        <div className="mt-8 sm:mt-12 bg-[#0C0A0E] rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white">
          <h2 className="font-display text-2xl sm:text-3xl font-light mb-6 sm:mb-8 flex items-center gap-3">
            <Droplets className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400" />
            How to Use
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8">
            {[
              { n: '01', t: 'Apply', d: 'Pour a few drops into the palm of your hand.' },
              { n: '02', t: 'Massage', d: 'Gently massage from roots to tips and scalp.' },
              { n: '03', t: 'Enjoy', d: 'Leave in without rinsing for best results.' },
            ].map(({ n, t, d }) => (
              <div key={n} className="text-center">
                <div className="font-display text-5xl font-semibold text-white/10 mb-2">{n}</div>
                <h4 className="font-semibold text-white text-base mb-2">{t}</h4>
                <p className="text-gray-400 text-sm font-light">{d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantees */}
        <div className="mt-4 sm:mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: <Leaf className="w-4 h-4 text-green-500" />, label: '100% Natural' },
            { icon: <CheckCircle className="w-4 h-4 text-blue-500" />, label: 'Paraben Free' },
            { icon: <Shield className="w-4 h-4 text-purple-500" />, label: 'Derm Tested' },
            { icon: <Star className="w-4 h-4 text-amber-500" />, label: 'Premium Quality' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 p-4 bg-gray-50 rounded-xl border border-gray-100">
              {icon}
              <span className="text-xs font-medium text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
