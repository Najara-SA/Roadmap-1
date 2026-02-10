
import React from 'react';
import { RoadmapItem, RoadmapStatus, Priority, Team } from '../types';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar,
  MoreVertical,
  Activity,
  Zap,
  Link as LinkIcon
} from 'lucide-react';

interface RoadmapBoardProps {
  items: RoadmapItem[];
  teams: Team[];
  onEditItem: (item: RoadmapItem) => void;
  onMoveItem: (id: string, newStatus: RoadmapStatus) => void;
}

const STATUS_COLUMNS = [
  { status: RoadmapStatus.BACKLOG, icon: AlertCircle, color: 'text-gray-300' },
  { status: RoadmapStatus.PLANNING, icon: Clock, color: 'text-indigo-300' },
  { status: RoadmapStatus.IN_DEVELOPMENT, icon: Activity, color: 'text-amber-300' },
  { status: RoadmapStatus.COMPLETED, icon: CheckCircle2, color: 'text-emerald-300' },
];

const RoadmapBoard: React.FC<RoadmapBoardProps> = ({ items, teams, onEditItem, onMoveItem }) => {
  return (
    <div className="flex gap-8 h-full min-w-max pb-4">
      {STATUS_COLUMNS.map((col) => (
        <div key={col.status} className="w-80 flex flex-col">
          <div className="flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                <col.icon className={`h-4 w-4 ${col.color}`} />
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">{col.status}</h3>
              <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-black">
                {items.filter(item => item.status === col.status).length}
              </span>
            </div>
          </div>

          <div className="flex-1 bg-gray-50/50 rounded-[2rem] border border-gray-100 p-4 space-y-5 overflow-y-auto custom-scrollbar">
            {items
              .filter(item => item.status === col.status)
              .map(item => (
                <RoadmapCard 
                  key={item.id} 
                  item={item} 
                  team={teams.find(t => t.id === item.teamId)}
                  onEdit={() => onEditItem(item)} 
                />
              ))}
            
            {items.filter(item => item.status === col.status).length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <div className="w-16 h-16 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center mb-4 opacity-40">
                  <Zap className="h-6 w-6" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Empty Queue</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const RoadmapCard: React.FC<{ item: RoadmapItem; team?: Team; onEdit: () => void }> = ({ item, team, onEdit }) => {
  const priorityColor = {
    [Priority.HIGH]: 'bg-red-50 text-red-700 border-red-100',
    [Priority.MEDIUM]: 'bg-amber-50 text-amber-700 border-amber-100',
    [Priority.LOW]: 'bg-blue-50 text-blue-700 border-blue-100',
  };

  return (
    <div 
      onClick={onEdit}
      className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer group animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2">
          <span className={`text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-lg border ${priorityColor[item.priority]}`}>
            {item.priority}
          </span>
          {team && (
            <span className={`text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-lg text-white ${team.color}`}>
              {team.name}
            </span>
          )}
        </div>
        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-50 rounded-lg transition-opacity">
          <MoreVertical className="h-4 w-4 text-gray-400" />
        </button>
      </div>
      
      <h4 className="text-base font-extrabold text-gray-900 mb-1.5 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors">
        {item.title}
      </h4>
      <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed font-medium">
        {item.description}
      </p>

      {item.dependencies.length > 0 && (
        <div className="flex items-center gap-2 mb-4 text-[9px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-1.5 rounded-xl w-fit">
          <LinkIcon className="h-3 w-3" />
          {item.dependencies.length} CROSS-TEAM
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {item.tags.map(tag => (
          <span key={tag} className="text-[10px] font-bold bg-gray-50 text-gray-400 px-2 py-0.5 rounded-lg">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <Calendar className="h-3.5 w-3.5" />
          {item.quarter}
        </div>
        {item.integrationSource && (
          <div className="flex items-center gap-1">
             <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">Synced: {item.integrationSource}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapBoard;
