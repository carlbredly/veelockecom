import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Package, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const lowestPrice = Math.min(...product.variants.map((v) => v.price));
  const defaultVariant = product.variants[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, defaultVariant, 1);
    toast.success(`Added to cart!`, {
      icon: '🛍️',
      style: { background: '#fff', color: '#1a1a1a', border: '1px solid #f3f4f6', borderRadius: '12px', fontSize: '13px' },
    });
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-rose-200 transition-all duration-400 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
        {/* Image */}
        <div className="relative overflow-hidden bg-gradient-to-br from-rose-50 to-amber-50 aspect-square">
          {!imgError ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className={`w-full h-full object-contain p-6 transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
              <Package className="w-12 h-12 mb-2" />
              <span className="text-xs">No image</span>
            </div>
          )}

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-gray-900 text-white font-semibold px-4 py-2 rounded-full text-xs tracking-wide">
                Out of Stock
              </span>
            </div>
          )}

          {/* Low stock badge */}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full tracking-wide">
              Only {product.stock} left
            </span>
          )}

          {/* Quick view icon */}
          <div className={`absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
            <ArrowUpRight className="w-4 h-4 text-gray-700" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {/* Category + rating */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-rose-500 font-semibold uppercase tracking-[0.15em]">
              {product.category}
            </span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>

          <h3 className="font-display text-lg font-medium text-gray-900 leading-tight mb-1.5 line-clamp-2 group-hover:text-rose-600 transition-colors">
            {product.name}
          </h3>

          <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2 font-light">
            {product.shortDescription}
          </p>

          {/* Hair types */}
          <div className="flex flex-wrap gap-1 mb-4">
            {product.hairTypes.slice(0, 2).map((type) => (
              <span key={type} className="text-[10px] bg-gray-50 text-gray-600 border border-gray-100 px-2 py-0.5 rounded-full">
                {type}
              </span>
            ))}
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 block">From</span>
              <span className="font-semibold text-gray-900 text-base">
                {lowestPrice.toLocaleString('en')} <span className="text-xs font-normal text-gray-500">FCFA</span>
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex items-center gap-1.5 bg-gray-900 hover:bg-rose-600 disabled:bg-gray-200 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-300"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
