import React, { useState, useEffect } from 'react';
import { X, Trash2, Flag } from 'lucide-react';
import { Milestone } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (milestone: Milestone) => void;
  onDelete?: (id: string) => void;
  milestone?: Milestone;
}

const MilestoneModal: React.FC<MilestoneModalProps> = ({
  isOpen, onClose, onSave, onDelete, milestone
}) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<Milestone>({
    id: '',
    title: '',
    description: ''
  });

  useEffect(() => {
    if (milestone) {
      setFormData(milestone);
    } else {
      setFormData({
        id: Math.random().toString(36).substring(2, 9),
        title: '',
        description: ''
      });
    }
  }, [milestone, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 ring-1 ring-slate-200/50">
        <div className="px-10 pt-10 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm shadow-amber-100/50"><Flag className="h-6 w-6" /></div>
            <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">{milestone ? t('edit') + ' ' + t('milestones') : t('milestones')}</h2>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-slate-600"><X className="h-6 w-6" /></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-10 space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t('title')}</label>
              <input required type="text" className="w-full px-6 py-4 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-bold text-slate-900 text-lg shadow-sm placeholder:text-slate-300" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Key release..." />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{t('description')}</label>
              <textarea className="w-full px-6 py-4 border border-slate-200 rounded-[1.5rem] outline-none resize-none bg-slate-50/50 text-slate-700 min-h-[80px] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium" rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
            {milestone && onDelete && <button type="button" onClick={() => onDelete(formData.id)} className="text-rose-500 hover:bg-rose-50 p-3 rounded-2xl transition-all group"><Trash2 className="h-6 w-6 group-hover:scale-110 transition-transform" /></button>}
            <div className="flex gap-4 ml-auto">
              <button type="button" onClick={onClose} className="px-8 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all">{t('cancel')}</button>
              <button type="submit" className="px-10 py-3 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-2xl shadow-xl shadow-amber-100 transition-all active:scale-95">{t('save')}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MilestoneModal;
