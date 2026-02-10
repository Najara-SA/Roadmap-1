
import React, { useState, useEffect } from 'react';
import { X, Trash2, Flag, Calendar } from 'lucide-react';
import { Milestone } from '../types';

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (milestone: Milestone) => void;
  onDelete?: (id: string) => void;
  milestone?: Milestone;
  productId: string;
  month: number;
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const MilestoneModal: React.FC<MilestoneModalProps> = ({ 
  isOpen, onClose, onSave, onDelete, milestone, productId, month 
}) => {
  const [formData, setFormData] = useState<Milestone>({
    id: '',
    productId: productId,
    title: '',
    month: month || 0,
    description: ''
  });

  useEffect(() => {
    if (milestone) {
      setFormData(milestone);
    } else {
      setFormData({
        id: Math.random().toString(36).substring(2, 9),
        productId: productId,
        title: '',
        month: month || 0,
        description: ''
      });
    }
  }, [milestone, productId, month, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600"><Flag className="h-5 w-5" /></div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">{milestone ? 'Edit Milestone' : 'Add Milestone'}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="h-5 w-5 text-gray-400" /></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Milestone Title</label>
              <input required type="text" className="w-full px-5 py-3 border border-gray-200 rounded-2xl outline-none font-bold text-gray-900" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Key release..." />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Target Month</label>
              <div className="relative">
                <select className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl outline-none appearance-none bg-gray-50/50 font-bold text-xs" value={formData.month} onChange={e => setFormData({ ...formData, month: parseInt(e.target.value) })}>
                  {MONTH_NAMES.map((m, i) => <option key={m} value={i}>{m}</option>)}
                </select>
                <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Context</label>
              <textarea className="w-full px-5 py-3 border border-gray-200 rounded-2xl outline-none resize-none bg-gray-50/50 text-sm" rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            {milestone && onDelete && <button type="button" onClick={() => onDelete(formData.id)} className="p-2 text-red-500 mr-auto"><Trash2 className="h-5 w-5" /></button>}
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-xs font-bold text-gray-500">Cancel</button>
            <button type="submit" className="px-8 py-2.5 text-xs font-bold text-white bg-amber-600 rounded-xl shadow-lg shadow-amber-100">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MilestoneModal;
