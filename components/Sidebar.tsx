
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
  LayoutGrid
} from 'lucide-react';
import { ViewType, Team } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  teams: Team[];
  activeTeamId: string;
  onTeamChange: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
  teams,
  activeTeamId,
  onTeamChange
}) => {
  const { t } = useTranslation();

  const navItems = [
    { id: 'portfolio' as ViewType, label: t('strategyMatrix'), icon: LayoutGrid },
    { id: 'board' as ViewType, label: t('featureBoard'), icon: LayoutDashboard },
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
            <h2 className="font-display font-black text-slate-900 leading-none text-xl tracking-tight">VisionPath</h2>
            <p className="text-[10px] text-indigo-600/80 font-bold uppercase tracking-[0.2em] mt-1 italic">Roadmap</p>
          </div>
        </div>

        <div className="mb-10">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Context</label>
          <div className="relative group">
            <select
              value={activeTeamId}
              onChange={(e) => onTeamChange(e.target.value)}
              className="w-full pl-10 pr-8 py-3 text-xs font-bold text-slate-700 bg-slate-50/50 border border-slate-200 rounded-2xl appearance-none focus:outline-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer transition-all hover:bg-white"
            >
              <option value="all">Enterprise-wide</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
            <Users className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <ChevronDown className="absolute right-3.5 top-4 h-3 w-3 text-slate-400 pointer-events-none group-hover:translate-y-0.5 transition-transform" />
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-sm font-bold rounded-2xl transition-all relative overflow-hidden group ${activeView === item.id
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-1'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <item.icon className={`h-4.5 w-4.5 transition-colors ${activeView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span className="relative z-10">{item.label}</span>
              {activeView === item.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] duration-1000 transition-transform"></div>
              )}
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