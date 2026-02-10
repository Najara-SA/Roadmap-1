
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

interface TimelineViewProps {
  items: RoadmapItem[];
  onEditItem: (item: RoadmapItem) => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({ items, onEditItem }) => {
  const sortedItems = [...items].sort((a, b) => a.quarter.localeCompare(b.quarter));

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[11px] font-extrabold uppercase tracking-[0.2em] mb-6">
          <Target className="h-4 w-4" /> Strategic Sequence
        </div>
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">Execution Roadmap</h2>
        <p className="text-gray-500 mt-3 text-lg font-medium leading-relaxed">A detailed view of cascaded requirements and themes.</p>
      </div>

      <div className="relative">
        <div className="absolute left-[27px] top-0 bottom-0 w-[2px] bg-gray-100"></div>
        
        <div className="space-y-20">
          {['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'].map(quarter => {
            const quarterItems = sortedItems.filter(i => i.quarter === quarter);
            if (quarterItems.length === 0) return null;

            return (
              <div key={quarter} className="relative pl-20">
                <div className="absolute left-0 w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center z-10 shadow-xl shadow-gray-100 transition-transform hover:scale-110">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                </div>
                
                <h3 className="text-2xl font-extrabold text-gray-900 mb-10 flex items-center gap-6">
                  {quarter}
                  <div className="h-px flex-1 bg-gray-100"></div>
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
  const [isExpanded, setIsExpanded] = useState(false);
  
  const completedCount = (item.subFeatures || []).filter(sf => sf.isCompleted).length;
  const totalCount = (item.subFeatures || []).length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="group/card bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all overflow-hidden">
      <div className="p-8 cursor-pointer" onClick={onEdit}>
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className={`p-5 rounded-2xl bg-gray-50 group-hover/card:bg-indigo-50 transition-colors`}>
              {item.status === RoadmapStatus.COMPLETED ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <Activity className="h-6 w-6 text-indigo-500" />}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <h4 className="text-xl font-extrabold text-gray-900 group-hover/card:text-indigo-600 transition-colors leading-tight tracking-tight">{item.title}</h4>
                {totalCount > 0 && (
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-extrabold rounded-full uppercase tracking-widest">
                    {completedCount}/{totalCount}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-lg">{item.description}</p>
            </div>
          </div>
          <ChevronRight className="h-6 w-6 text-gray-200 group-hover/card:text-indigo-400 transition-colors flex-shrink-0" />
        </div>

        {totalCount > 0 && (
          <div className="mt-8 flex flex-col gap-2">
            <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-700 ease-out" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {totalCount > 0 && (
        <div className="border-t border-gray-100 bg-gray-50/30">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="w-full flex items-center justify-between px-8 py-4 hover:bg-gray-100/50 transition-colors"
          >
            <div className="flex items-center gap-2.5 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
              <ListTree className="h-4 w-4" />
              Cascade Details
            </div>
            {isExpanded ? <ChevronUp className="h-5 w-5 text-indigo-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
          </button>

          {isExpanded && (
            <div className="px-10 pb-10 pt-6 bg-white space-y-5 animate-in slide-in-from-top-4 duration-300">
              {item.subFeatures.map((sf) => (
                <div key={sf.id} className="flex items-center gap-4">
                  {sf.isCompleted ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-gray-200" />}
                  <span className={`text-base font-semibold ${sf.isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
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