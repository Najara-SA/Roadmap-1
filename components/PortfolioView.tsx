
import React, { useState } from 'react';
import { RoadmapItem, Product, Milestone, Priority } from '../types';
import { Star, Edit3, ChevronDown, ChevronUp, CheckCircle2, Timer } from 'lucide-react';

interface PortfolioViewProps {
  items: RoadmapItem[];
  products: Product[];
  milestones: Milestone[];
  onEditItem: (item: RoadmapItem) => void;
  onEditProduct: (product: Product) => void;
  onEditMilestone: (milestone: Milestone) => void;
  onAddMilestone: (productId: string, month: number) => void;
  onMoveItem: (itemId: string, newStartMonth: number) => void;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

const PortfolioView: React.FC<PortfolioViewProps> = ({ 
  items, products, milestones, onEditItem, onEditProduct, onEditMilestone, onAddMilestone, onMoveItem 
}) => {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header Temporal */}
      <div className="flex border-b border-gray-100 sticky top-0 z-40 bg-white">
        <div className="w-64 flex-shrink-0 p-6 border-r border-gray-100 flex items-center bg-white">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Portfolio Matrix</span>
        </div>
        <div className="flex-1 flex overflow-hidden">
          {QUARTERS.map((q, qIdx) => (
            <div key={q} className="flex-1 grid grid-cols-3 border-r border-gray-100 last:border-r-0">
              <div className="col-span-3 py-2 border-b border-gray-50 flex items-center justify-center bg-gray-50/20">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">{q}</span>
              </div>
              {MONTHS.slice(qIdx * 3, qIdx * 3 + 3).map((m) => (
                <div key={m} className="py-2.5 text-center">
                  <span className="text-[11px] font-extrabold text-gray-500 tracking-tight">{m}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Grid de Conteúdo */}
      <div className="flex-1 overflow-auto custom-scrollbar bg-gray-50/10">
        <div className="min-w-[1200px]">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="p-6 rounded-full bg-white border border-dashed border-gray-200 text-gray-300 mb-4">
                <Star className="h-10 w-10" />
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Your portfolio is empty</p>
            </div>
          ) : (
            products.map(product => (
              <div key={product.id} className="flex border-b border-gray-100 group/row bg-white transition-colors hover:bg-gray-50/5">
                <div className="w-64 flex-shrink-0 p-8 border-r border-gray-100 sticky left-0 z-30 bg-white group-hover/row:bg-gray-50/10 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`h-8 w-8 ${product.color} rounded-xl shadow-sm flex items-center justify-center text-white cursor-pointer`} onClick={() => onEditProduct(product)}>
                      <Edit3 className="h-3.5 w-3.5 opacity-0 group-hover/row:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="font-black text-gray-900 leading-tight text-sm tracking-tight">{product.name}</h3>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium leading-relaxed line-clamp-2">{product.description}</p>
                </div>

                <div className="flex-1 relative min-h-[160px]">
                  <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
                    {MONTHS.map((_, i) => (
                      <div key={i} className="border-r border-gray-50 last:border-r-0" />
                    ))}
                  </div>

                  <div className="relative p-8 grid grid-cols-12 gap-y-4 auto-rows-min">
                    {items
                      .filter(item => item.productId === product.id)
                      .map(item => {
                        const span = Math.min(item.spanMonths || 1, 12 - item.startMonth);
                        return (
                          <div 
                            key={item.id} 
                            style={{ gridColumn: `${item.startMonth + 1} / span ${span}` }}
                            className="transition-all"
                            draggable
                            onDragStart={() => setDraggedItemId(item.id)}
                          >
                            <CleanItemCard item={item} onEdit={() => onEditItem(item)} />
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const CleanItemCard: React.FC<{ item: RoadmapItem; onEdit: () => void }> = ({ item, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isHighPriority = item.priority === Priority.HIGH;
  const completedCount = (item.subFeatures || []).filter(sf => sf.isCompleted).length;
  const totalCount = (item.subFeatures || []).length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  return (
    <div className={`group/card mx-1 rounded-xl border bg-white shadow-sm transition-all flex flex-col ${isHighPriority ? 'border-amber-100 ring-2 ring-amber-400/5' : 'border-gray-100'} ${isExpanded ? 'z-40 shadow-xl scale-[1.01] border-indigo-200' : 'hover:shadow hover:border-indigo-100'}`}>
      <div className="p-3.5 cursor-grab active:cursor-grabbing" onClick={onEdit}>
        <div className="flex justify-between items-start gap-2 mb-2">
          <h4 className="text-[11px] font-black text-gray-800 leading-tight tracking-tight group-hover/card:text-indigo-600 transition-colors truncate">
            {item.title}
          </h4>
          {isHighPriority && <Star className="h-3 w-3 text-amber-400 fill-amber-400 flex-shrink-0" />}
        </div>
        
        {totalCount > 0 && (
          <div className="flex items-center gap-2">
             <div className="flex-1 h-1 bg-gray-50 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${progressPercent}%` }}></div>
             </div>
             <span className="text-[9px] font-black text-gray-300 tabular-nums">{Math.round(progressPercent)}%</span>
          </div>
        )}
      </div>

      {totalCount > 0 && (
        <button onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} className="w-full flex items-center justify-center py-1 hover:bg-indigo-50 transition-colors border-t border-gray-50">
          {isExpanded ? <ChevronUp className="h-3 w-3 text-indigo-300" /> : <ChevronDown className="h-3 w-3 text-gray-300" />}
        </button>
      )}

      {isExpanded && (
        <div className="px-4 pb-4 pt-2 bg-gray-50/30 border-t border-gray-50 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="space-y-1.5">
            {item.subFeatures.map((sf) => (
              <div key={sf.id} className="flex items-center gap-2">
                {sf.isCompleted ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <div className="h-3 w-3 rounded-full border border-gray-200" />}
                <span className={`text-[10px] font-bold truncate ${sf.isCompleted ? 'text-gray-300 line-through' : 'text-gray-600'}`}>
                  {sf.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioView;
