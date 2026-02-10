import React, { useState } from 'react';
import { RoadmapItem, RoadmapStatus } from '../types';
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
  onEditItem: (item: RoadmapItem) => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({ items, onEditItem }) => {
  const { t } = useTranslation();
  const sortedItems = [...items].sort((a, b) => a.quarter.localeCompare(b.quarter));

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <div className="mb-16 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm border border-indigo-100/50">
          <Target className="h-4 w-4" /> {t('strategicSequence')}
        </div>
        <h2 className="text-5xl font-display font-black text-slate-900 tracking-tight leading-tight">{t('executionRoadmap')}</h2>
        <p className="text-slate-500 mt-4 text-xl font-medium leading-relaxed max-w-2xl mx-auto">{t('roadmapSubTitle')}</p>
      </div>

      <div className="relative">
        <div className="absolute left-[27px] top-0 bottom-0 w-[2px] bg-slate-100"></div>

        <div className="space-y-20">
          {['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'].map(quarter => {
            const quarterItems = sortedItems.filter(i => i.quarter === quarter);
            if (quarterItems.length === 0) return null;

            return (
              <div key={quarter} className="relative pl-20 group">
                <div className="absolute left-0 w-14 h-14 bg-white border border-slate-100 rounded-[1.25rem] flex items-center justify-center z-10 shadow-xl shadow-slate-100/50 transition-all group-hover:scale-110 group-hover:border-indigo-100 group-hover:shadow-indigo-100/30">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                </div>

                <h3 className="text-3xl font-display font-black text-slate-900 mb-10 flex items-center gap-8">
                  {quarter}
                  <div className="h-px flex-1 bg-slate-100 group-hover:bg-indigo-100 transition-colors"></div>
                </h3>

                <div className="space-y-8">
                  {quarterItems.map(item => (
                    <TimelineItemCard key={item.id} item={item} onEdit={() => onEditItem(item)} />
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

const TimelineItemCard: React.FC<{ item: RoadmapItem; onEdit: () => void }> = ({ item, onEdit }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const completedCount = (item.subFeatures || []).filter(sf => sf.isCompleted).length;
  const totalCount = (item.subFeatures || []).length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="group/card bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all overflow-hidden duration-500 hover:-translate-y-1">
      <div className="p-10 cursor-pointer" onClick={onEdit}>
        <div className="flex items-center justify-between gap-10">
          <div className="flex items-center gap-10">
            <div className={`p-6 rounded-[1.5rem] bg-slate-50 group-hover/card:bg-indigo-50 transition-all group-hover/card:scale-110 duration-500 shadow-sm`}>
              {item.status === RoadmapStatus.COMPLETED ? <CheckCircle2 className="h-8 w-8 text-emerald-500" /> : <Activity className="h-8 w-8 text-indigo-500" />}
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h4 className="text-2xl font-display font-black text-slate-900 group-hover/card:text-indigo-600 transition-colors leading-tight tracking-tight">{item.title}</h4>
                {totalCount > 0 && (
                  <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[11px] font-black rounded-full uppercase tracking-widest border border-indigo-100/50">
                    {completedCount}/{totalCount}
                  </span>
                )}
              </div>
              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">{item.description}</p>
            </div>
          </div>
          <ChevronRight className="h-8 w-8 text-slate-200 group-hover/card:text-indigo-400 transition-all flex-shrink-0 group-hover/card:translate-x-2" />
        </div>

        {totalCount > 0 && (
          <div className="mt-10 flex flex-col gap-3">
            <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full ${progressPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-600'} transition-all duration-1000 ease-out shadow-lg`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {totalCount > 0 && (
        <div className="border-t border-slate-100 bg-slate-50/20">
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="w-full flex items-center justify-between px-10 py-5 hover:bg-slate-50/50 transition-all"
          >
            <div className="flex items-center gap-3 text-[12px] font-black text-slate-400 uppercase tracking-widest">
              <ListTree className="h-5 w-5" />
              {t('cascadeDetails')}
            </div>
            {isExpanded ? <ChevronUp className="h-6 w-6 text-indigo-400 animate-bounce" /> : <ChevronDown className="h-6 w-6 text-slate-400" />}
          </button>

          {isExpanded && (
            <div className="px-12 pb-12 pt-8 bg-white space-y-4 animate-in slide-in-from-top-4 duration-500">
              {item.subFeatures.map((sf) => (
                <div key={sf.id} className="flex items-center gap-5 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  {sf.isCompleted ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <Circle className="h-6 w-6 text-slate-200" />}
                  <span className={`text-lg font-bold ${sf.isCompleted ? 'text-slate-300 line-through' : 'text-slate-700'}`}>
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