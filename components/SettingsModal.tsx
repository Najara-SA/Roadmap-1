import React, { useState } from 'react';
import { X, Plus, Trash2, Edit3, Users, Target, Palette } from 'lucide-react';
import { Vertical, Milestone, Product } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    verticals: Vertical[];
    milestones: Milestone[];
    products: Product[];
    onSaveVertical: (vertical: Vertical) => void;
    onDeleteVertical: (id: string) => void;
    onSaveMilestone: (milestone: Milestone) => void;
    onDeleteMilestone: (id: string) => void;
}

const COLORS = [
    'bg-indigo-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600',
    'bg-sky-600', 'bg-violet-600', 'bg-slate-700', 'bg-fuchsia-600'
];

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    verticals,
    milestones,
    products,
    onSaveVertical,
    onDeleteVertical,
    onSaveMilestone,
    onDeleteMilestone
}) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'families' | 'milestones'>('families');

    // Family state
    const [newFamilyName, setNewFamilyName] = useState('');
    const [newFamilyColor, setNewFamilyColor] = useState(COLORS[0]);

    // Milestone state
    const [newMilestone, setNewMilestone] = useState({
        title: '',
        description: '',
        productId: products[0]?.id || '',
        month: 0
    });

    if (!isOpen) return null;

    const handleAddFamily = () => {
        if (!newFamilyName.trim()) return;
        const newFamily: Vertical = {
            id: Math.random().toString(36).substring(2, 9),
            name: newFamilyName,
            color: newFamilyColor
        };
        onSaveVertical(newFamily);
        setNewFamilyName('');
        setNewFamilyColor(COLORS[0]);
    };

    const handleAddMilestone = () => {
        if (!newMilestone.title.trim()) return;
        const milestone: Milestone = {
            id: Math.random().toString(36).substring(2, 9),
            ...newMilestone
        };
        onSaveMilestone(milestone);
        setNewMilestone({
            title: '',
            description: '',
            productId: products[0]?.id || '',
            month: 0
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-8 pt-8 pb-6 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-display font-bold text-slate-900">{t('systemConfiguration')}</h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-600">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mt-6">
                        <button
                            onClick={() => setActiveTab('families')}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'families'
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            <Users className="h-4 w-4 inline mr-2" />
                            {t('productFamilies')}
                        </button>
                        <button
                            onClick={() => setActiveTab('milestones')}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'milestones'
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            <Target className="h-4 w-4 inline mr-2" />
                            {t('milestones')}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 max-h-[60vh] overflow-y-auto">
                    {activeTab === 'families' ? (
                        <div className="space-y-6">
                            {/* Add New Family */}
                            <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{t('newFamily')}</h3>
                                <input
                                    type="text"
                                    placeholder={t('familyName')}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                                    value={newFamilyName}
                                    onChange={(e) => setNewFamilyName(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddFamily()}
                                />
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-500 uppercase">{t('color')}:</span>
                                    <div className="flex gap-2">
                                        {COLORS.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setNewFamilyColor(color)}
                                                className={`h-8 w-8 rounded-lg ${color} transition-all ${newFamilyColor === color ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'opacity-70 hover:opacity-100'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={handleAddFamily}
                                    className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
                                >
                                    <Plus className="h-4 w-4 inline mr-2" />
                                    {t('addFamily')}
                                </button>
                            </div>

                            {/* Existing Families */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{t('existingFamilies')}</h3>
                                {verticals.length === 0 ? (
                                    <p className="text-sm text-slate-400 text-center py-8">{t('noFamilies')}</p>
                                ) : (
                                    verticals.map(family => (
                                        <div key={family.id} className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-200 transition-all group">
                                            <div className={`h-10 w-10 ${family.color} rounded-xl flex-shrink-0`}></div>
                                            <span className="flex-1 font-bold text-slate-900">{family.name}</span>
                                            <button
                                                onClick={() => onDeleteVertical(family.id)}
                                                className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Add New Milestone */}
                            <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{t('newMilestone')}</h3>
                                <input
                                    type="text"
                                    placeholder={t('milestoneTitle')}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                                    value={newMilestone.title}
                                    onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                                />
                                <textarea
                                    placeholder={t('description')}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium resize-none"
                                    rows={2}
                                    value={newMilestone.description}
                                    onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t('product')}</label>
                                        <select
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                                            value={newMilestone.productId}
                                            onChange={(e) => setNewMilestone({ ...newMilestone, productId: e.target.value })}
                                        >
                                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t('month')}</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="11"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                                            value={newMilestone.month}
                                            onChange={(e) => setNewMilestone({ ...newMilestone, month: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleAddMilestone}
                                    className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
                                >
                                    <Plus className="h-4 w-4 inline mr-2" />
                                    {t('addMilestone')}
                                </button>
                            </div>

                            {/* Existing Milestones */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{t('existingMilestones')}</h3>
                                {milestones.length === 0 ? (
                                    <p className="text-sm text-slate-400 text-center py-8">{t('noMilestones')}</p>
                                ) : (
                                    milestones.map(milestone => (
                                        <div key={milestone.id} className="p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-200 transition-all group">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-slate-900 mb-1">{milestone.title}</h4>
                                                    <p className="text-sm text-slate-500">{milestone.description}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-xs font-bold text-slate-400">{products.find(p => p.id === milestone.productId)?.name}</span>
                                                        <span className="text-xs text-slate-300">•</span>
                                                        <span className="text-xs font-bold text-indigo-600">{t('month')} {milestone.month + 1}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => onDeleteMilestone(milestone.id)}
                                                    className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
