
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
import { useTranslation } from '../hooks/useTranslation';

interface RoadmapBoardProps {
  items: RoadmapItem[];
  teams: Team[];
  onEditItem: (item: RoadmapItem) => void;
  onMoveItem: (id: string, newStatus: RoadmapStatus) => void;
}

const RoadmapBoard: React.FC<RoadmapBoardProps> = ({ items, teams, onEditItem, onMoveItem }) => {
  const { t } = useTranslation();

  const STATUS_COLUMNS = [
    { status: RoadmapStatus.BACKLOG, icon: AlertCircle, color: 'text-slate-300', label: t('backlog') },
    { status: RoadmapStatus.PLANNING, icon: Clock, color: 'text-indigo-400', label: t('planning') },
    { status: RoadmapStatus.IN_DEVELOPMENT, icon: Activity, color: 'text-amber-400', label: t('inDevelopment') },
    { status: RoadmapStatus.COMPLETED, icon: CheckCircle2, color: 'text-emerald-400', label: t('completed') },
  ];

  return (
    <div className="flex gap-10 h-full min-w-max pb-6">
      {STATUS_COLUMNS.map((col) => (
        <div key={col.status} className="w-85 flex flex-col">
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white rounded-xl border border-slate-100 shadow-sm">
                <col.icon className={`h-5 w-5 ${col.color}`} />
              </div>
              <h3 className="text-[13px] font-display font-black text-slate-800 uppercase tracking-widest">{col.label}</h3>
              <span className="bg-slate-200/50 text-slate-500 text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                {items.filter(item => item.status === col.status).length}
              </span>
            </div>
          </div>

          <div className="flex-1 bg-slate-50/50 rounded-[2.5rem] border border-slate-200/50 p-6 space-y-6 overflow-y-auto custom-scrollbar shadow-inner drop-shadow-sm">
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
              <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                <div className="w-20 h-20 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center mb-6 opacity-40 group hover:border-indigo-200 transition-colors">
                  <Zap className="h-8 w-8 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">{t('loading') || 'No items'}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const RoadmapCard: React.FC<{ item: RoadmapItem; team?: Team; onEdit: () => void }> = ({ item, team, onEdit }) => {
  const { t } = useTranslation();
  const priorityColor = {
    [Priority.HIGH]: 'bg-rose-50 text-rose-700 border-rose-100 shadow-rose-100/20',
    [Priority.MEDIUM]: 'bg-amber-50 text-amber-700 border-amber-100 shadow-amber-100/20',
    [Priority.LOW]: 'bg-indigo-50 text-indigo-700 border-indigo-100 shadow-indigo-100/20',
  };

  const priorityLabel = {
    [Priority.HIGH]: t('high'),
    [Priority.MEDIUM]: t('medium'),
    [Priority.LOW]: t('low'),
  };

  return (
    <div
      onClick={onEdit}
      className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-indigo-100/10 hover:border-indigo-200/50 transition-all cursor-pointer group animate-in fade-in slide-in-from-bottom-3 duration-500 hover:-translate-y-1"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap gap-2">
          <span className={`text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded-lg border shadow-sm ${priorityColor[item.priority]}`}>
            {priorityLabel[item.priority]}
          </span>
          {team && (
            <span className={`text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded-lg text-white shadow-sm ${team.color} brightness-110`}>
              {team.name}
            </span>
          )}
        </div>
        <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-50 rounded-xl transition-all">
          <MoreVertical className="h-4 w-4 text-slate-400" />
        </button>
      </div>

      <h4 className="text-base font-display font-bold text-slate-900 mb-2 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors">
        {item.title}
      </h4>
      <p className="text-[12px] text-slate-500 line-clamp-2 mb-5 leading-relaxed font-medium">
        {item.description}
      </p>

      {item.dependencies.length > 0 && (
        <div className="flex items-center gap-2 mb-5 text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50/50 px-3 py-2 rounded-2xl w-fit ring-1 ring-indigo-100/50">
          <LinkIcon className="h-3 w-3" />
          {item.dependencies.length} DEPENDENCIES
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {item.tags.map(tag => (
          <span key={tag} className="text-[10px] font-bold bg-slate-100 text-slate-400 px-2.5 py-1 rounded-xl transition-colors hover:bg-indigo-50 hover:text-indigo-400">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-5 border-t border-slate-50">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <Calendar className="h-4 w-4 text-indigo-400/60" />
          {item.quarter}
        </div>
        {item.integrationSource && (
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-wider">{item.integrationSource}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapBoard;
