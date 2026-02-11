
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
  overallProgress: number;
  quarterProgress: number;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
  verticals,
  activeVerticalId,
  onVerticalChange,
  onAddVertical,
  onDeleteVertical,
  overallProgress,
  quarterProgress,
  onOpenSettings
}) => {
  const { t } = useTranslation();

  const navItems = [
    { id: 'portfolio' as ViewType, label: t('strategyMatrix'), icon: LayoutGrid },
    { id: 'timeline' as ViewType, label: t('executionTimeline'), icon: CalendarRange },
    { id: 'analytics' as ViewType, label: t('insights'), icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/60 flex flex-col flex-shrink-0 z-30">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-11 w-11 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200/50 group duration-500 hover:rotate-12 transition-transform">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-slate-900 leading-none text-xl tracking-tight">Roadmap MD</h2>
            <p className="text-xs text-indigo-600/80 font-bold uppercase tracking-[0.2em] mt-1 italic">Product Vision</p>
          </div>
        </div>

        <div className="mb-10">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.15em] leading-none font-display mb-4 ml-1">{t('context')}</label>
          <div className="relative group">
            <select
              value={activeVerticalId}
              onChange={(e) => onVerticalChange(e.target.value)}
              className="w-full pl-10 pr-8 py-4 text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200/50 rounded-2xl appearance-none focus:outline-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer transition-all hover:bg-white hover:border-indigo-200/50 shadow-sm"
            >
              <option value="all">{t('all')}</option>
              {verticals.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
            <Users className="absolute left-3.5 top-4 h-4 w-4 text-slate-400" />
            <ChevronDown className="absolute right-3.5 top-5 h-3 w-3 text-slate-400 pointer-events-none group-hover:translate-y-0.5 transition-transform" />
          </div>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${activeView === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-1' : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'}`}
            >
              <item.icon className={`h-5 w-5 ${activeView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`} />
              <span className="text-sm font-bold tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-4">
        {/* Q1 Progress Card */}
        <div className="p-6 bg-indigo-50 border border-indigo-100/50 rounded-3xl group transition-all">
          <div className="flex items-center gap-2.5 mb-4">
            <Target className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600">Q1 Progress</span>
          </div>
          <p className="text-sm font-bold leading-relaxed mb-4 text-slate-500">{activeVerticalId === 'all' ? 'All Families' : verticals.find(v => v.id === activeVerticalId)?.name}</p>
          <div className="bg-slate-200/50 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.3)]" style={{ width: `${quarterProgress}%` }}></div>
          </div>
          <div className="mt-2 text-right">
            <span className="text-xs font-black text-indigo-600">{Math.round(quarterProgress)}%</span>
          </div>
        </div>

        {/* Overall Progress Card (Purple Premium) */}
        <div className="p-6 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
          <div className="flex items-center gap-2.5 mb-4">
            <Target className="h-4 w-4 text-indigo-200" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-100">Progresso Geral</span>
          </div>
          <p className="text-sm font-bold leading-relaxed mb-4 text-white/90">Consolidado da Família</p>
          <div className="bg-white/20 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(52,211,153,0.5)]" style={{ width: `${overallProgress}%` }}></div>
          </div>
          <div className="mt-2 text-right">
            <span className="text-xs font-black text-white">{Math.round(overallProgress)}%</span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        </div>

        <button onClick={onOpenSettings} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-widest hover:bg-indigo-50 rounded-2xl">
          <Settings className="h-4 w-4" />
          {t('systemConfiguration')}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;