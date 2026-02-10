import React, { useState } from 'react';
import { RoadmapItem, RoadmapStatus, Milestone, Product } from '../types';
import {
  Calendar,
  ChevronRight,
  CheckCircle2,
  Clock,
  Activity,
  Target,
  ChevronDown,
  ChevronUp,
  Circle,
  ListTree
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface TimelineViewProps {
  items: RoadmapItem[];
  milestones: Milestone[];
  onEditItem: (item: RoadmapItem) => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({ items, milestones, onEditItem }) => {
  const { t } = useTranslation();
  const sortedItems = [...items].sort((a, b) => a.quarter.localeCompare(b.quarter));

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
          <Target className="h-3.5 w-3.5" /> {t('strategicSequence')}
        </div>
        <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">{t('executionTimeline')}</h2>
        <p className="text-slate-500 mt-2 text-sm font-medium max-w-2xl mx-auto">{t('roadmapSubTitle')}</p>
      </div>

      <div className="relative">
        <div className="absolute left-[27px] top-0 bottom-0 w-[2px] bg-slate-100"></div>

        <div className="space-y-10">
          {['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'].map(quarter => {
            const quarterItems = sortedItems.filter(i => i.quarter === quarter);
            if (quarterItems.length === 0) return null;

            return (
              <div key={quarter} className="relative pl-16 group">
                <div className="absolute left-0 w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center z-10 shadow-sm transition-all group-hover:border-indigo-200">
                  <Calendar className="h-4 w-4 text-indigo-600" />
                </div>

                <h3 className="text-xl font-display font-bold text-slate-900 mb-6 flex items-center gap-4">
                  {quarter}
                  <div className="h-px flex-1 bg-slate-200"></div>
                </h3>

                <div className="space-y-4">
                  {quarterItems.map(item => (
                    <TimelineItemCard key={item.id} item={item} milestones={milestones} onEdit={() => onEditItem(item)} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const TimelineItemCard: React.FC<{ item: RoadmapItem; milestones: Milestone[]; onEdit: () => void }> = ({ item, milestones, onEdit }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const completedCount = (item.subFeatures || []).filter(sf => sf.isCompleted).length;
  const totalCount = (item.subFeatures || []).length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="group/card bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all overflow-hidden">
      <div className="p-5 cursor-pointer" onClick={onEdit}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-slate-50 group-hover/card:bg-indigo-50 transition-all`}>
              {item.status === RoadmapStatus.COMPLETED ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Activity className="h-5 w-5 text-indigo-500" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <h4 className="text-base font-bold text-slate-900 group-hover/card:text-indigo-600 transition-colors">{item.title}</h4>
                {item.milestoneId && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 rounded-lg border border-indigo-100">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500"></div>
                    <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider">
                      {milestones.find(m => m.id === item.milestoneId)?.title || 'Milestone'}
                    </span>
                  </div>
                )}
                {totalCount > 0 && (
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md">
                    {completedCount}/{totalCount}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 line-clamp-2">{item.description}</p>
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {item.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold rounded uppercase tracking-wide">
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-500 text-[9px] font-bold rounded">+{item.tags.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300 group-hover/card:text-indigo-400 transition-all flex-shrink-0" />
        </div>

        {totalCount > 0 && (
          <div className="mt-3">
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${progressPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-600'} transition-all duration-500`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {totalCount > 0 && (
        <div className="border-t border-slate-100">
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-all"
          >
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              <ListTree className="h-4 w-4" />
              {t('cascadeDetails')}
            </div>
            {isExpanded ? <ChevronUp className="h-4 w-4 text-indigo-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
          </button>

          {isExpanded && (
            <div className="px-5 pb-5 pt-2 bg-slate-50/50 space-y-2">
              {item.subFeatures.map((sf) => (
                <div key={sf.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors">
                  {sf.isCompleted ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Circle className="h-4 w-4 text-slate-300" />}
                  <span className={`text-sm font-medium ${sf.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    {sf.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimelineView;