import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Package, X, Check } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { getAllProducts, upsertProduct, deleteProduct as deleteProductApi } from '../../lib/api';
import toast from 'react-hot-toast';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>({
    name: '', description: '', shortDescription: '',
    ingredients: [], variants: [{ size: '100ml', price: 5000 }],
    images: ['/oil.png'], hairTypes: [], isActive: true, stock: 0, category: 'oil', featured: false,
  });
  const [ingredientInput, setIngredientInput] = useState('');
  const [hairTypeInput, setHairTypeInput] = useState('');

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setForm({ name: '', description: '', shortDescription: '', ingredients: [], variants: [{ size: '100ml', price: 5000 }], images: ['/oil.png'], hairTypes: [], isActive: true, stock: 0, category: 'oil', featured: false });
    setIngredientInput(''); setHairTypeInput(''); setEditingProduct(null);
  };

  const handleSave = async () => {
    if (!form.name || !form.description) { toast.error('Name and description required'); return; }
    setSaving(true);
    try {
      const saved = await upsertProduct({ ...form, id: editingProduct?.id });
      if (editingProduct) {
        setProducts((prev) => prev.map((p) => p.id === editingProduct.id ? saved : p));
        toast.success('Product updated!');
      } else {
        setProducts((prev) => [...prev, saved]);
        toast.success('Product added!');
      }
      resetForm(); setShowForm(false);
    } catch {
      toast.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProductApi(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const updateVariant = (i: number, field: keyof ProductVariant, value: string | number) => {
    const v = [...(form.variants || [])];
    v[i] = { ...v[i], [field]: field === 'price' ? Number(value) : value };
    setForm({ ...form, variants: v });
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-100 rounded w-36" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-40 bg-gray-100 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-light text-gray-900">Products</h1>
          <p className="text-gray-400 mt-1 text-sm">{products.length} products in catalog</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="flex items-center gap-2 bg-gray-900 hover:bg-rose-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-sm">
          <h2 className="font-display text-2xl font-light text-gray-900 mb-6">
            {editingProduct ? 'Edit Product' : 'New Product'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Name *</label>
              <input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Vee Locs Original Oil"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-900 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Tagline *</label>
              <input value={form.shortDescription || ''} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} placeholder="Short description..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-900 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Category</label>
              <select value={form.category || 'oil'} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-900 focus:outline-none">
                {['oil', 'growth', 'scalp', 'shine', 'bundle'].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Full Description *</label>
              <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-900 focus:outline-none resize-none" placeholder="Detailed product description..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Stock</label>
              <input type="number" value={form.stock || 0} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} min={0}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-900 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Main Image URL</label>
              <input value={form.images?.[0] || ''} onChange={(e) => setForm({ ...form, images: [e.target.value, ...(form.images?.slice(1) || [])] })} placeholder="https://..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-900 focus:outline-none" />
            </div>
            {/* Variants */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Size Variants</label>
              <div className="space-y-2">
                {form.variants?.map((v, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input value={v.size} onChange={(e) => updateVariant(i, 'size', e.target.value)} placeholder="Size (e.g. 100ml)"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-gray-900 focus:outline-none" />
                    <input type="number" value={v.price} onChange={(e) => updateVariant(i, 'price', e.target.value)} placeholder="Price FCFA"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-gray-900 focus:outline-none" />
                    <button onClick={() => setForm({ ...form, variants: form.variants?.filter((_, j) => j !== i) })} className="text-red-400 hover:text-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button onClick={() => setForm({ ...form, variants: [...(form.variants || []), { size: '', price: 0 }] })}
                  className="text-xs text-rose-500 hover:text-rose-700 font-medium flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add Variant
                </button>
              </div>
            </div>
            {/* Ingredients */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Ingredients</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.ingredients?.map((ing, i) => (
                  <span key={i} className="flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full border border-green-200">
                    {ing}
                    <button onClick={() => setForm({ ...form, ingredients: form.ingredients?.filter((_, j) => j !== i) })}><X className="w-2.5 h-2.5" /></button>
                  </span>
                ))}
              </div>
              <input value={ingredientInput} onChange={(e) => setIngredientInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && ingredientInput.trim()) { setForm({ ...form, ingredients: [...(form.ingredients || []), ingredientInput.trim()] }); setIngredientInput(''); }}}
                placeholder="Add ingredient (press Enter)" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none" />
            </div>
            {/* Hair Types */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Hair Types</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.hairTypes?.map((ht, i) => (
                  <span key={i} className="flex items-center gap-1 bg-rose-50 text-rose-700 text-xs px-2.5 py-1 rounded-full border border-rose-200">
                    {ht}
                    <button onClick={() => setForm({ ...form, hairTypes: form.hairTypes?.filter((_, j) => j !== i) })}><X className="w-2.5 h-2.5" /></button>
                  </span>
                ))}
              </div>
              <input value={hairTypeInput} onChange={(e) => setHairTypeInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && hairTypeInput.trim()) { setForm({ ...form, hairTypes: [...(form.hairTypes || []), hairTypeInput.trim()] }); setHairTypeInput(''); }}}
                placeholder="e.g. Locs, Natural, Braids (press Enter)" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none" />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                <input type="checkbox" checked={form.isActive || false} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 text-gray-900 rounded" />
                Visible in store
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                <input type="checkbox" checked={form.featured || false} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 text-amber-500 rounded" />
                Featured product
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-gray-900 hover:bg-rose-600 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
              {editingProduct ? 'Save Changes' : 'Add Product'}
            </button>
            <button onClick={() => { resetForm(); setShowForm(false); }} className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 text-sm font-medium">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Image', 'Product', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-rose-50 flex items-center justify-center">
                      {p.images[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-contain p-1" /> : <Package className="w-5 h-5 text-gray-300" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-sm text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{p.category}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-gray-900">{Math.min(...p.variants.map((v) => v.price)).toLocaleString('en')} FCFA</span>
                    <p className="text-xs text-gray-400">{p.variants.length} variant(s)</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.stock > 10 ? 'bg-green-100 text-green-700' : p.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                      {p.stock > 0 ? `${p.stock} units` : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.isActive ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditingProduct(p); setForm({ ...p }); setShowForm(true); }} className="text-blue-500 hover:text-blue-700 transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={async () => {
                        try {
                          await upsertProduct({ ...p, id: p.id, isActive: !p.isActive });
                          setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, isActive: !x.isActive } : x));
                        } catch { toast.error('Failed'); }
                      }} className="text-gray-400 hover:text-gray-700">
                        {p.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
