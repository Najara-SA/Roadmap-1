
import React, { useState, useEffect } from 'react';
import { X, Trash2, Box, Flag, Clock, Calendar, ChevronDown, ChevronRight, Plus, CheckCircle2, Circle } from 'lucide-react';
import { RoadmapItem, RoadmapStatus, Priority, Team, Product, Milestone, SubFeature } from '../types';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: any) => void;
  onDelete?: () => void;
  item?: RoadmapItem;
  teams: Team[];
  products: Product[];
  milestones: Milestone[];
  allItems: RoadmapItem[];
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const ItemModal: React.FC<ItemModalProps> = ({ 
  isOpen, onClose, onSave, onDelete, item, teams, products, milestones
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: RoadmapStatus.BACKLOG,
    priority: Priority.MEDIUM,
    startMonth: 0,
    spanMonths: 1,
    teamId: teams[0]?.id || '',
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
      setFormData({
        title: item.title,
        description: item.description,
        status: item.status,
        priority: item.priority,
        startMonth: item.startMonth || 0,
        spanMonths: item.spanMonths || 1,
        teamId: item.teamId,
        productId: item.productId,
        milestoneId: item.milestoneId || '',
        effort: item.effort,
        value: item.value,
        tagsString: (item.tags || []).join(', '),
        subFeatures: item.subFeatures || []
      });
    } else if (teams.length > 0 && products.length > 0) {
      setFormData(prev => ({ ...prev, teamId: teams[0].id, productId: products[0].id }));
    }
  }, [item, teams, products]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">{item ? 'Feature Intelligence' : 'New Strategic Theme'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="h-5 w-5 text-gray-400" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Main Info */}
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Theme Title</label>
              <input required type="text" className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 outline-none transition-all font-bold text-gray-900" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>

            {/* Sub-Features Cascade Section */}
            <div className="bg-indigo-50/30 border border-indigo-100/50 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Cascade Detail (Sub-features)</label>
                <div className="text-[10px] font-bold text-indigo-400">
                  {formData.subFeatures.filter(f => f.isCompleted).length} / {formData.subFeatures.length} Complete
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                {formData.subFeatures.map((sf) => (
                  <div key={sf.id} className="flex items-center gap-3 group">
                    <button type="button" onClick={() => toggleSubFeature(sf.id)} className="transition-colors">
                      {sf.isCompleted ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-gray-300" />}
                    </button>
                    <span className={`flex-1 text-sm font-medium ${sf.isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{sf.title}</span>
                    <button type="button" onClick={() => removeSubFeature(sf.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 px-4 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 outline-none"
                  placeholder="Add detailed requirement..."
                  value={newSubFeatureTitle}
                  onChange={e => setNewSubFeatureTitle(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSubFeature())}
                />
                <button type="button" onClick={addSubFeature} className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Product</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-2xl outline-none appearance-none bg-gray-50/50 font-bold text-xs" value={formData.productId} onChange={e => setFormData({ ...formData, productId: e.target.value, milestoneId: '' })}>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Start Month</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-2xl outline-none bg-gray-50/50 font-bold text-xs" value={formData.startMonth} onChange={e => setFormData({ ...formData, startMonth: parseInt(e.target.value) })}>
                  {MONTH_NAMES.map((m, i) => <option key={m} value={i}>{m}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Duration (Months)</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-2xl outline-none bg-gray-50/50 font-bold text-xs" value={formData.spanMonths} onChange={e => setFormData({ ...formData, spanMonths: parseInt(e.target.value) })}>
                  {[1,2,3,4,5,6].map(v => <option key={v} value={v}>{v} {v === 1 ? 'Month' : 'Months'}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Strategic Priority</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-2xl outline-none bg-gray-50/50 font-bold text-xs" value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value as Priority })}>
                  {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </div>
        </form>

        <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-between">
          {item && onDelete ? <button type="button" onClick={onDelete} className="text-xs font-bold text-red-500 px-4 py-2 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="h-4 w-4 inline mr-2" />Remove Item</button> : <div />}
          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50 rounded-xl">Cancel</button>
            <button onClick={handleSubmit} className="px-8 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xl shadow-indigo-100 transition-all active:scale-95">{item ? 'Update Strategy' : 'Finalize Theme'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
