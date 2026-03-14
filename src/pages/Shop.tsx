import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../lib/api';
import { Product } from '../types';

const HAIR_TYPES = ['All', 'Locs', 'Natural', 'Braids', 'Relaxed', 'Long', 'Straight', 'All Types'];
const CATEGORIES = ['All', 'oil', 'growth', 'scalp', 'shine', 'bundle'];
const SIZES = ['All', '50ml', '100ml', '200ml', '500ml', 'Trio 3 × 100ml'];
const CATEGORY_LABELS: Record<string, string> = {
  All: 'All', oil: 'Original Oil', growth: 'Growth', scalp: 'Scalp', shine: 'Shine', bundle: 'Bundles',
};

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedHairType, setSelectedHairType] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
          !p.shortDescription.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedHairType !== 'All' && !p.hairTypes.includes(selectedHairType)) return false;
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedSize !== 'All' && !p.variants.some((v) => v.size === selectedSize)) return false;
      return true;
    });
  }, [products, search, selectedHairType, selectedCategory, selectedSize]);

  const hasFilters = search !== '' || selectedHairType !== 'All' || selectedCategory !== 'All' || selectedSize !== 'All';
  const reset = () => { setSearch(''); setSelectedHairType('All'); setSelectedCategory('All'); setSelectedSize('All'); };

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#0C0A0E] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(244,63,110,0.15),transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <span className="text-xs text-amber-500 font-semibold tracking-[0.25em] uppercase block mb-3">Our Collection</span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-light mb-4">The Shop</h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto font-light">
            100% natural hair oils crafted to nourish, strengthen, and transform every hair type.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        {/* Search + filter bar */}
        <div className="flex gap-2 sm:gap-3 mb-5 sm:mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 text-sm bg-white" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${showFilters ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'}`}>
            <SlidersHorizontal className="w-4 h-4" />
            Filter
            {hasFilters && <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />}
          </button>
          {hasFilters && (
            <button onClick={reset} className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-red-100 text-red-400 bg-white text-sm hover:bg-red-50 transition-colors">
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
              {[
                { label: 'Category', items: CATEGORIES, selected: selectedCategory, labels: CATEGORY_LABELS, set: setSelectedCategory, activeColor: 'bg-gray-900 text-white', inactiveColor: 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400' },
                { label: 'Hair Type', items: HAIR_TYPES, selected: selectedHairType, labels: {} as Record<string,string>, set: setSelectedHairType, activeColor: 'bg-rose-500 text-white', inactiveColor: 'bg-white text-gray-700 border border-gray-200 hover:border-rose-300' },
                { label: 'Size', items: SIZES, selected: selectedSize, labels: {} as Record<string,string>, set: setSelectedSize, activeColor: 'bg-amber-500 text-white', inactiveColor: 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300' },
              ].map(({ label, items, selected, labels, set, activeColor, inactiveColor }) => (
                <div key={label}>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">{label}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <button key={item} onClick={() => set(item)}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${selected === item ? activeColor : inactiveColor}`}>
                        {labels[item] || item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-5 sm:mb-7">
          <span className="font-semibold text-gray-900">{filtered.length}</span> product{filtered.length !== 1 ? 's' : ''} found
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-display text-2xl text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-400 text-sm mb-6">Try adjusting your search or filters</p>
            <button onClick={reset} className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-rose-600 transition-colors">
              View All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
