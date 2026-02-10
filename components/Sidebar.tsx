
import React from 'react';
import {
  LayoutDashboard,
  CalendarRange,
  BarChart3,
  Settings,
  Target,
  Layers,
  Link2,
  Users,
  ChevronDown,
  LayoutGrid,
  Plus,
  Settings2,
  Check,
  MoreVertical,
  Trash2
} from 'lucide-react';
import { ViewType, Vertical } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  verticals: Vertical[];
  activeVerticalId: string;
  onVerticalChange: (id: string) => void;
  onAddVertical: (vertical: Vertical) => void;
  onDeleteVertical: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
  verticals,
  activeVerticalId,
  onVerticalChange,
  onAddVertical,
  onDeleteVertical
}) => {
  const { t } = useTranslation();
  const [isEditingVerticals, setIsEditingVerticals] = React.useState(false);
  const [newVerticalName, setNewVerticalName] = React.useState('');

  const navItems = [
    { id: 'portfolio' as ViewType, label: t('strategyMatrix'), icon: LayoutGrid },
    { id: 'timeline' as ViewType, label: t('executionTimeline'), icon: CalendarRange },
    { id: 'analytics' as ViewType, label: t('insights'), icon: BarChart3 },
  ];

  const handleAddVertical = () => {
    if (!newVerticalName.trim()) return;
    const newV: Vertical = {
      id: Math.random().toString(36).substring(2, 9),
      name: newVerticalName,
      color: 'bg-indigo-500' // Default color
    };
    onAddVertical(newV);
    setNewVerticalName('');
  };

  const handleRemoveVertical = (id: string) => {
    onDeleteVertical(id);
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200/60 flex flex-col flex-shrink-0 z-30">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-11 w-11 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200/50 group duration-500 hover:rotate-12 transition-transform">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-slate-900 leading-none text-xl tracking-tight">VisionPath</h2>
            <p className="text-[10px] text-indigo-600/80 font-bold uppercase tracking-[0.2em] mt-1 italic">Roadmap</p>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-4 ml-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none font-display">{t('context')}</label>
            <button
              onClick={() => setIsEditingVerticals(!isEditingVerticals)}
              className="text-[10px] font-black text-indigo-500 hover:text-indigo-600 transition-all uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-lg"
            >
              {isEditingVerticals ? t('done') : t('manage')}
            </button>
          </div>

          {!isEditingVerticals ? (
            <div className="relative group">
              <select
                value={activeVerticalId}
                onChange={(e) => onVerticalChange(e.target.value)}
                className="w-full pl-10 pr-8 py-4 text-[13px] font-bold text-slate-700 bg-slate-50 border border-slate-200/50 rounded-2xl appearance-none focus:outline-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer transition-all hover:bg-white hover:border-indigo-200/50 shadow-sm"
              >
                <option value="all">{t('all')}</option>
                {verticals.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
              <Users className="absolute left-3.5 top-4 h-4 w-4 text-slate-400" />
              <ChevronDown className="absolute right-3.5 top-5 h-3 w-3 text-slate-400 pointer-events-none group-hover:translate-y-0.5 transition-transform" />
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              {verticals.map(v => (
                <div key={v.id} className="flex items-center gap-2 pr-2 pl-3 py-2 bg-slate-50/50 border border-slate-200/40 rounded-xl group hover:border-rose-100 transition-all">
                  <span className="flex-1 text-[12px] font-bold text-slate-700 truncate">{v.name}</span>
                  <button onClick={() => handleRemoveVertical(v.id)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-lg transition-all active:scale-90">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder={t('newVerticalTitle')}
                  className="flex-1 px-4 py-2.5 text-[12px] font-medium border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all"
                  value={newVerticalName}
                  onChange={(e) => setNewVerticalName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddVertical()}
                />
                <button
                  onClick={handleAddVertical}
                  className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all group ${activeView === item.id
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200'
                : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                }`}
            >
              <item.icon className={`h-5 w-5 ${activeView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'} transition-colors`} />
              <span className="text-[13px] font-bold tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-4">
        <div className="p-6 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
          <div className="flex items-center gap-2.5 mb-4">
            <Target className="h-4 w-4 text-indigo-200" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-100">Q1 Progress</span>
          </div>
          <p className="text-[11px] font-bold leading-relaxed mb-4 text-white/90">Target: Core UI Refinement</p>
          <div className="bg-white/20 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(52,211,153,0.5)]" style={{ width: '85%' }}></div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        </div>

        <button className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-widest hover:bg-indigo-50 rounded-2xl">
          <Settings className="h-4 w-4" />
          {activeView === 'portfolio' ? 'System Configuration' : 'Settings'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;