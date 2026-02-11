
import React, { useState, useEffect } from 'react';
import { X, Trash2, Box, Flag, Clock, Calendar, ChevronDown, ChevronRight, Plus, CheckCircle2, Circle } from 'lucide-react';
import { RoadmapItem, RoadmapStatus, Priority, Vertical, Product, Milestone, SubFeature } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: any) => void;
  onDelete?: () => void;
  item?: RoadmapItem;
  verticals: Vertical[];
  products: Product[];
  milestones: Milestone[];
  allItems: RoadmapItem[];
}

const ItemModal: React.FC<ItemModalProps> = ({
  isOpen, onClose, onSave, onDelete, item, verticals, products, milestones
}) => {
  const { t, language } = useTranslation();

  const MONTH_NAMES = language === 'pt'
    ? ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    : language === 'es'
      ? ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: RoadmapStatus.BACKLOG,
    priority: Priority.MEDIUM,
    startMonth: 0,
    spanMonths: 1,
    verticalId: verticals[0]?.id || '',
    productId: products[0]?.id || '',
    milestoneId: '',
    effort: 3,
    value: 3,
    tagsString: '',
    subFeatures: [] as SubFeature[]
  });

  const [newSubFeatureTitle, setNewSubFeatureTitle] = useState('');

  useEffect(() => {
    if (item) {
      // Logic to auto-fix inconsistency: if Product has a family, prefer that family over item's verticalId
      const product = products.find(p => p.id === item.productId);
      const effectiveVerticalId = (product && product.familyId) ? product.familyId : (item.verticalId || verticals[0]?.id || '');

      setFormData({
        title: item.title,
        description: item.description,
        status: item.status,
        priority: item.priority,
        startMonth: item.startMonth || 0,
        spanMonths: item.spanMonths || 1,
        verticalId: effectiveVerticalId,
        productId: item.productId,
        milestoneId: item.milestoneId || '',
        effort: item.effort,
        value: item.value,
        tagsString: (item.tags || []).join(', '),
        subFeatures: item.subFeatures || []
      });
    } else if (verticals.length > 0) {
      // Smart default: Select first vertical, then select first product belonging to it
      const initialVerticalId = verticals[0].id;
      const validProducts = products.filter(p => p.familyId === initialVerticalId);

      setFormData(prev => ({
        ...prev,
        verticalId: initialVerticalId,
        productId: validProducts[0]?.id || ''
      }));
    }
  }, [item, verticals, products]);

  const addSubFeature = () => {
    if (!newSubFeatureTitle.trim()) return;
    const newSF: SubFeature = {
      id: Math.random().toString(36).substring(2, 9),
      title: newSubFeatureTitle,
      isCompleted: false
    };
    setFormData(prev => ({ ...prev, subFeatures: [...prev.subFeatures, newSF] }));
    setNewSubFeatureTitle('');
  };

  const toggleSubFeature = (id: string) => {
    setFormData(prev => ({
      ...prev,
      subFeatures: prev.subFeatures.map(sf => sf.id === id ? { ...sf, isCompleted: !sf.isCompleted } : sf)
    }));
  };

  const removeSubFeature = (id: string) => {
    setFormData(prev => ({
      ...prev,
      subFeatures: prev.subFeatures.filter(sf => sf.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = formData.tagsString.split(',').map(t => t.trim()).filter(t => t !== '');
    const { tagsString, ...rest } = formData;
    onSave(item ? { ...item, ...rest, tags } : { ...rest, tags });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-500 ring-1 ring-slate-200/50">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
              <Box className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">{item ? t('editItem') : t('addItem')}</h2>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-slate-600"><X className="h-6 w-6" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          {/* Main Info */}
          <div className="space-y-8">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t('title')}</label>
              <input required type="text" className="w-full px-6 py-4 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-bold text-slate-900 text-lg placeholder:text-slate-300 shadow-sm" placeholder={t('titlePlaceholder')} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t('description')}</label>
              <textarea className="w-full px-6 py-4 border border-slate-200 rounded-3xl outline-none resize-none bg-slate-50/50 text-slate-700 min-h-[100px] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium" rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>

            {/* Sub-Features Cascade Section */}
            <div className="bg-indigo-50/20 border border-indigo-100/50 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                  <label className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">{t('subFeatures')}</label>
                </div>
                <div className="text-[10px] font-bold text-indigo-400 bg-white px-3 py-1 rounded-full border border-indigo-100/50 shadow-sm">
                  {formData.subFeatures.filter(f => f.isCompleted).length} / {formData.subFeatures.length} {t('completed')}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {formData.subFeatures.map((sf) => (
                  <div key={sf.id} className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-white transition-all border border-transparent hover:border-indigo-50 hover:shadow-sm">
                    <button type="button" onClick={() => toggleSubFeature(sf.id)} className="transition-all transform hover:scale-110">
                      {sf.isCompleted ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <Circle className="h-6 w-6 text-slate-200" />}
                    </button>
                    <span className={`flex-1 text-sm font-bold ${sf.isCompleted ? 'text-slate-300 line-through' : 'text-slate-700'}`}>{sf.title}</span>
                    <button type="button" onClick={() => removeSubFeature(sf.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all p-1.5 hover:bg-rose-50 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  className="flex-1 px-5 py-3 text-sm border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-300"
                  placeholder={t('requirementPlaceholder')}
                  value={newSubFeatureTitle}
                  onChange={e => setNewSubFeatureTitle(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSubFeature())}
                />
                <button type="button" onClick={addSubFeature} className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t('vertical')}</label>
                <div className="relative">
                  <select className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl outline-none appearance-none bg-slate-50/50 font-bold text-sm text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all" value={formData.verticalId} onChange={e => {
                    const newVid = e.target.value;
                    const validProducts = products.filter(p => p.familyId === newVid);
                    setFormData({ ...formData, verticalId: newVid, productId: validProducts[0]?.id || '' });
                  }}>
                    {verticals.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t('product')}</label>
                <div className="relative">
                  <select className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl outline-none appearance-none bg-slate-50/50 font-bold text-sm text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all" value={formData.productId} onChange={e => setFormData({ ...formData, productId: e.target.value, milestoneId: '' })}>
                    {products.filter(p => p.familyId === formData.verticalId).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t('startDate')}</label>
                <div className="relative">
                  <select className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl outline-none appearance-none bg-slate-50/50 font-bold text-sm text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all" value={formData.startMonth} onChange={e => setFormData({ ...formData, startMonth: parseInt(e.target.value) })}>
                    {MONTH_NAMES.map((m, i) => <option key={m} value={i}>{m}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t('duration')}</label>
                <div className="relative">
                  <select className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl outline-none appearance-none bg-slate-50/50 font-bold text-sm text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all" value={formData.spanMonths} onChange={e => setFormData({ ...formData, spanMonths: parseInt(e.target.value) })}>
                    {[1, 2, 3, 4, 5, 6].map(v => <option key={v} value={v}>{v} {v === 1 ? t('monthUnit') : t('monthsUnit')}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t('milestones')}</label>
                <div className="relative">
                  <select
                    className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl outline-none appearance-none bg-slate-50/50 font-bold text-sm text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all"
                    value={formData.milestoneId}
                    onChange={e => setFormData({ ...formData, milestoneId: e.target.value })}
                  >
                    <option value="">None</option>
                    {milestones.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t('priority')}</label>
              <div className="relative">
                <select className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl outline-none appearance-none bg-slate-50/50 font-bold text-sm text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all" value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value as Priority })}>
                  {Object.values(Priority).map(p => <option key={p} value={p}>{p === Priority.HIGH ? t('high') : p === Priority.MEDIUM ? t('medium') : t('low')}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t('tags')}</label>
              <input type="text" className="w-full px-6 py-4 border border-slate-200 rounded-3xl outline-none bg-slate-50/50 text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-bold placeholder:text-slate-300" placeholder={t('tagsPlaceholder')} value={formData.tagsString} onChange={e => setFormData({ ...formData, tagsString: e.target.value })} />
            </div>
          </div>
        </form>

        <div className="px-10 py-8 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
          {item && onDelete ? <button type="button" onClick={onDelete} className="text-sm font-bold text-rose-500 px-5 py-2.5 hover:bg-rose-50 rounded-2xl transition-all group items-center flex gap-2"><Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />{t('delete')}</button> : <div />}
          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="px-8 py-3 text-sm font-bold text-slate-500 hover:bg-slate-200/50 rounded-2xl transition-all">{t('cancel')}</button>
            <button onClick={handleSubmit} className="px-10 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95 active:shadow-none">{t('save')}</button>
          </div>
        </div>
      </div >
    </div >
  );
};

export default ItemModal;
