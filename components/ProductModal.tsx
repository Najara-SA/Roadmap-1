
import React, { useState, useEffect } from 'react';
import { X, Trash2, Box, Palette, ChevronDown } from 'lucide-react';
import { Product, Vertical } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  onDelete?: (id: string) => void;
  product?: Product;
  productFamilies: Vertical[];
}

const COLORS = [
  'bg-indigo-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600',
  'bg-sky-600', 'bg-violet-600', 'bg-slate-700', 'bg-fuchsia-600'
];

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, onDelete, product, productFamilies }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Product>({
    id: '',
    familyId: productFamilies[0]?.id || '',
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
        familyId: productFamilies[0]?.id || '',
        name: '',
        description: '',
        color: COLORS[0]
      });
    }
  }, [product, isOpen, productFamilies]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 ring-1 ring-slate-200/50">
        <div className="px-10 pt-10 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 ${formData.color} rounded-[1.25rem] shadow-xl flex items-center justify-center text-white ring-4 ring-white`}>
              <Box className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">
              {product ? t('edit') + ' ' + t('product') : t('newTheme')}
            </h2>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-slate-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-10 space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t('vertical')}</label>
              <div className="relative">
                <select
                  className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl outline-none appearance-none bg-slate-50/50 font-bold text-sm text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all"
                  value={formData.familyId}
                  onChange={e => setFormData({ ...formData, familyId: e.target.value })}
                >
                  {productFamilies.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t('product')}</label>
              <input
                required
                type="text"
                className="w-full px-6 py-4 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-bold text-slate-900 text-lg shadow-sm placeholder:text-slate-300"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('productPlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t('description')}</label>
              <textarea
                className="w-full px-6 py-4 border border-slate-200 rounded-[1.5rem] outline-none resize-none bg-slate-50/50 text-slate-700 min-h-[100px] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium"
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('descriptionPlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">{t('branding')}</label>
              <div className="grid grid-cols-4 gap-4">
                {COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: c })}
                    className={`h-10 rounded-[1rem] transition-all ${c} ${formData.color === c ? 'ring-4 ring-offset-4 ring-indigo-500 scale-105 shadow-xl' : 'opacity-80 hover:opacity-100 hover:scale-105 shadow-sm'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
            {product && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(formData.id)}
                className="text-rose-500 hover:bg-rose-50 p-3 rounded-2xl transition-all group"
              >
                <Trash2 className="h-6 w-6 group-hover:scale-110 transition-transform" />
              </button>
            )}
            <div className="flex gap-4 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className={`px-10 py-3 text-sm font-bold text-white rounded-2xl shadow-xl transition-all active:scale-95 ${formData.color} shadow-${formData.color.split('-')[1]}-100`}
              >
                {t('save')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
