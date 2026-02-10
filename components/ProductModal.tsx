
import React, { useState, useEffect } from 'react';
import { X, Trash2, Box, Palette } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  onDelete?: (id: string) => void;
  product?: Product;
}

const COLORS = [
  'bg-indigo-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600', 
  'bg-sky-600', 'bg-purple-600', 'bg-slate-700', 'bg-orange-500'
];

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, onDelete, product }) => {
  const [formData, setFormData] = useState<Product>({
    id: '',
    name: '',
    description: '',
    color: COLORS[0]
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        id: Math.random().toString(36).substring(2, 9),
        name: '',
        description: '',
        color: COLORS[0]
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 ${formData.color} rounded-2xl shadow-lg flex items-center justify-center text-white`}>
              <Box className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              {product ? 'Edit Product' : 'New Product'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Product Identity</label>
              <input
                required
                type="text"
                className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 outline-none transition-all font-bold text-gray-900"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Product Name..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Strategic Vision</label>
              <textarea
                className="w-full px-5 py-3 border border-gray-200 rounded-2xl outline-none resize-none bg-gray-50/50 text-sm"
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Short description of the product purpose..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Portfolio Color Branding</label>
              <div className="flex flex-wrap gap-3">
                {COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: c })}
                    className={`h-8 w-8 rounded-xl transition-all ${c} ${formData.color === c ? 'ring-4 ring-offset-2 ring-indigo-500 scale-110' : 'opacity-80 hover:opacity-100'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            {product && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(formData.id)}
                className="text-red-500 hover:text-red-600 p-2 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
            <div className="flex gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-8 py-2.5 text-xs font-bold text-white rounded-xl shadow-xl transition-all active:scale-95 ${formData.color}`}
              >
                {product ? 'Update Portfolio' : 'Add to Portfolio'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
