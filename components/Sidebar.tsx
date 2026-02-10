
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
  const navItems = [
    { id: 'portfolio' as ViewType, label: 'Portfolio', icon: LayoutGrid },
    { id: 'board' as ViewType, label: 'Feature Board', icon: LayoutDashboard },
    { id: 'timeline' as ViewType, label: 'Detailed Timeline', icon: CalendarRange },
    { id: 'analytics' as ViewType, label: 'Strategic Insights', icon: BarChart3 },
    { id: 'integrations' as ViewType, label: 'Integrations', icon: Link2 },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col flex-shrink-0 z-30">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-10 w-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-gray-900 leading-none text-lg tracking-tight">VisionPath</h2>
            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-[0.2em] mt-1">Management</p>
          </div>
        </div>

        <div className="mb-10">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Workplace Context</label>
          <div className="relative group">
            <select 
              value={activeTeamId}
              onChange={(e) => onTeamChange(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-100 rounded-xl appearance-none focus:outline-none focus:ring-4 focus:ring-indigo-500/5 cursor-pointer transition-all"
            >
              <option value="all">Enterprise Wide</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
            <Users className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            <ChevronDown className="absolute right-3.5 top-3.5 h-3 w-3 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                activeView === item.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`h-4.5 w-4.5 ${activeView === item.id ? 'text-white' : 'text-gray-400'}`} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-4">
        <div className="p-5 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-50 relative overflow-hidden group">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-indigo-200" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-100">Q1 Progress</span>
          </div>
          <p className="text-xs font-bold leading-relaxed mb-3">Target: Q1 Core Stable</p>
          <div className="bg-white/20 h-1 rounded-full overflow-hidden">
            <div className="bg-white h-full rounded-full transition-all duration-1000" style={{ width: '68%' }}></div>
          </div>
        </div>
        
        <button className="w-full flex items-center gap-3 px-4 py-2 text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;