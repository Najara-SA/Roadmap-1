
import React, { useState } from 'react';
import { RoadmapItem, Product, Milestone, Priority, Vertical } from '../types';
import { Star, Edit3, ChevronDown, ChevronUp, CheckCircle2, Timer, Plus } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface PortfolioViewProps {
  items: RoadmapItem[];
  products: Product[];
  verticals: Vertical[];
  milestones: Milestone[];
  onEditItem: (item: RoadmapItem) => void;
  onEditProduct: (product: Product) => void;
  onEditMilestone: (milestone: Milestone) => void;
  onAddMilestone: (productId: string, month: number) => void;
  onMoveItem: (itemId: string, newStartMonth: number) => void;
  activeVerticalId?: string;
  activeQuarter?: string;
}

const PortfolioView: React.FC<PortfolioViewProps> = ({
  items, products, verticals, milestones, onEditItem, onEditProduct, onEditMilestone, onAddMilestone, onMoveItem, activeVerticalId = 'all', activeQuarter = 'all'
}) => {
  const { t, language } = useTranslation();
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const MONTHS = language === 'pt'
    ? ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    : language === 'es'
      ? ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header Temporal */}
      <div className="flex border-b border-slate-200/60 sticky top-0 z-40 bg-white/90 backdrop-blur-md">
        <div className="w-64 flex-shrink-0 p-6 border-r border-slate-200/60 flex items-center">
          <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] font-display">{t('strategyMatrix')}</span>
        </div>
        <div className="flex-1 flex overflow-hidden">
          {QUARTERS.map((q, qIdx) => {
            if (activeQuarter !== 'all' && q !== activeQuarter) return null;
            return (
              <div key={q} className="flex-1 grid grid-cols-3 border-r border-slate-200/60 last:border-r-0">
                <div className="col-span-3 py-2 border-b border-slate-100 flex items-center justify-center bg-slate-50/50">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] font-display">{q}</span>
                </div>
                {MONTHS.slice(qIdx * 3, qIdx * 3 + 3).map((m) => (
                  <div key={m} className="py-2.5 text-center">
                    <span className="text-sm font-bold text-slate-500 tracking-tight">{m}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid de Conteúdo */}
      <div className="flex-1 overflow-auto custom-scrollbar bg-slate-50/20">
        <div className="min-w-[1200px]">
          {verticals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t('noVerticals') || 'Nenhuma Família Cadastrada'}</p>
            </div>
          ) : (
            verticals.map(family => {
              const familyProducts = products.filter(p => p.familyId === family.id && items.some(i => i.productId === p.id));
              // if (familyProducts.length === 0) return null; 
              // We removed the return null check for the whole family block 2 steps ago?
              // No, we removed `if (familyProducts.length === 0) return null;` logic earlier.

              // Wait, previous state (before Step 1683) was:
              // const familyProducts = products.filter(p => p.familyId === family.id && items.some(i => i.productId === p.id));
              // if (familyProducts.length === 0) return null;

              // Step 1683 changed it to:
              // const familyProducts = products.filter(p => p.familyId === family.id);
              // const familyOrphanItems = ...
              // if (familyProducts.length === 0 && familyOrphanItems.length === 0) return null;

              // Now I want to:
              // Keep Orphan Items logic.
              // Restrict familyProducts to ONLY those with items.

              const familyOrphanItems = items.filter(i => i.verticalId === family.id && (!i.productId || !products.some(p => p.id === i.productId)));

              // Only existing products with items are shown:
              const visibleFamilyProducts = products.filter(p => p.familyId === family.id && items.some(i => i.productId === p.id));

              if (visibleFamilyProducts.length === 0 && familyOrphanItems.length === 0) return null;

              return (
                <div key={family.id} className="border-b-4 border-slate-200/40">
                  {/* Family Header Row */}
                  <div className="flex bg-slate-50/80 border-b border-slate-200/60 sticky left-0 z-20">
                    <div className="w-64 flex-shrink-0 p-4 pl-8 border-r border-slate-200/60 flex items-center gap-3">
                      <div className={`h-3 w-3 ${family.color} rounded-full`}></div>
                      <span className="text-sm font-black text-slate-600 uppercase tracking-[0.2em]">{family.name}</span>
                    </div>
                    <div className="flex-1 bg-white/30"></div>
                  </div>

                  {/* Sub-products Rows */}
                  {visibleFamilyProducts.map(product => (
                    <div key={product.id} className="flex border-b border-slate-100 group/row bg-white transition-colors hover:bg-slate-50/30">
                      <RowHeader product={product} onEdit={() => onEditProduct(product)} />
                      <div className="flex-1 relative min-h-[180px]">
                        <GridBackground />
                        <div className={`relative p-8 grid ${activeQuarter === 'all' ? 'grid-cols-12' : 'grid-cols-3'} gap-y-6 auto-rows-min`}>
                          {items
                            .filter(item => item.productId === product.id && (activeQuarter === 'all' || item.quarter.startsWith(activeQuarter)))
                            .map(item => (
                              <ItemWrapper key={item.id} item={item} milestones={milestones} onEdit={() => onEditItem(item)} onDragStart={() => setDraggedItemId(item.id)} activeQuarter={activeQuarter} />
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Orphan Items for this Family */}
                  {familyOrphanItems.length > 0 && (
                    <div className="flex border-b border-slate-100 group/row bg-slate-50/20">
                      <div className="w-64 flex-shrink-0 p-8 border-r border-slate-200/60 sticky left-0 z-30 bg-white group-hover/row:bg-slate-50/50 transition-all flex items-center">
                        <div className="flex items-center gap-3 opacity-70">
                          <div className="h-9 w-9 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                            <Timer className="h-4 w-4" />
                          </div>
                          <h3 className="font-display font-medium text-slate-500 leading-tight text-sm tracking-tight">{t('standaloneThemes') || 'Temas Avulsos'}</h3>
                        </div>
                      </div>
                      <div className="flex-1 relative min-h-[180px]">
                        <GridBackground activeQuarter={activeQuarter} />
                        <div className={`relative p-8 grid ${activeQuarter === 'all' ? 'grid-cols-12' : 'grid-cols-3'} gap-y-6 auto-rows-min`}>
                          {familyOrphanItems
                            .filter(item => activeQuarter === 'all' || item.quarter.startsWith(activeQuarter))
                            .map(item => (
                              <ItemWrapper key={item.id} item={item} milestones={milestones} onEdit={() => onEditItem(item)} onDragStart={() => setDraggedItemId(item.id)} activeQuarter={activeQuarter} />
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Seção Geral para Itens Sem Vínculo (Show only if there are unlinked items or products AND we are in 'all' view) */}
          {activeVerticalId === 'all' && (products.filter(p => !p.familyId).length > 0 || items.filter(i => !i.productId || !products.some(p => p.id === i.productId)).length > 0) && (
            <div className="border-b-4 border-slate-200/40 opacity-90 hover:opacity-100 transition-opacity">
              <div className="flex bg-slate-100/80 border-b border-slate-200/60 sticky left-0 z-20">
                <div className="w-64 flex-shrink-0 p-4 pl-8 border-r border-slate-200/60 flex items-center gap-3">
                  <div className="h-3 w-3 bg-slate-400 rounded-full"></div>
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">{t('all') || 'Geral'} / {t('unlinked') || 'Sem Categoria'}</span>
                </div>
                <div className="flex-1"></div>
              </div>

              {/* Products without Family */}
              {products.filter(p => !p.familyId).map(product => (
                <div key={product.id} className="flex border-b border-slate-100 group/row bg-white transition-colors hover:bg-slate-50/30">
                  <RowHeader product={product} onEdit={() => onEditProduct(product)} />
                  <div className="flex-1 relative min-h-[180px]">
                    <GridBackground activeQuarter={activeQuarter} />
                    <div className={`relative p-8 grid ${activeQuarter === 'all' ? 'grid-cols-12' : 'grid-cols-3'} gap-y-6 auto-rows-min`}>
                      {items
                        .filter(item => item.productId === product.id && (activeQuarter === 'all' || item.quarter.startsWith(activeQuarter)))
                        .map(item => (
                          <ItemWrapper key={item.id} item={item} milestones={milestones} onEdit={() => onEditItem(item)} onDragStart={() => setDraggedItemId(item.id)} activeQuarter={activeQuarter} />
                        ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Items without Product AND without Family (True Orphans) */}
              {items.filter(i => (!i.productId || !products.some(p => p.id === i.productId)) && !verticals.some(v => v.id === i.verticalId)).length > 0 && (
                <div className="flex border-b border-slate-100 group/row bg-slate-50/30">
                  <div className="w-64 flex-shrink-0 p-8 border-r border-slate-200/60 sticky left-0 z-30 bg-slate-50/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-9 w-9 bg-slate-400 rounded-2xl flex items-center justify-center text-white">
                        <Timer className="h-4 w-4" />
                      </div>
                      <h3 className="font-display font-bold text-slate-600 leading-tight text-base tracking-tight">{t('standaloneThemes') || 'Temas Avulsos'}</h3>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{t('standaloneDesc') || 'Itens não associados a um módulo específico.'}</p>
                  </div>
                  <div className="flex-1 relative min-h-[180px]">
                    <GridBackground activeQuarter={activeQuarter} />
                    <div className={`relative p-8 grid ${activeQuarter === 'all' ? 'grid-cols-12' : 'grid-cols-3'} gap-y-6 auto-rows-min`}>
                      {items
                        .filter(i => (!i.productId || !products.some(p => p.id === i.productId)) && !verticals.some(v => v.id === i.verticalId) && (activeQuarter === 'all' || i.quarter.startsWith(activeQuarter)))
                        .map(item => (
                          <ItemWrapper key={item.id} item={item} milestones={milestones} onEdit={() => onEditItem(item)} onDragStart={() => setDraggedItemId(item.id)} activeQuarter={activeQuarter} />
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-components to keep cleaning
const GridBackground: React.FC<{ activeQuarter?: string }> = ({ activeQuarter = 'all' }) => (
  <div className={`absolute inset-0 grid ${activeQuarter === 'all' ? 'grid-cols-12' : 'grid-cols-3'} pointer-events-none opacity-50`}>
    {Array.from({ length: activeQuarter === 'all' ? 12 : 3 }).map((_, i) => (
      <div key={i} className="border-r border-slate-100 last:border-r-0" />
    ))}
  </div>
);

const RowHeader: React.FC<{ product: Product, onEdit: () => void }> = ({ product, onEdit }) => (
  <div className="w-64 flex-shrink-0 p-8 border-r border-slate-200/60 sticky left-0 z-30 bg-white group-hover/row:bg-slate-50/50 transition-all">
    <div className="flex items-center gap-3 mb-4">
      <div className={`h-9 w-9 ${product.color} rounded-2xl shadow-sm flex items-center justify-center text-white cursor-pointer group/icon hover:scale-105 transition-transform`} onClick={onEdit}>
        <Edit3 className="h-4 w-4 opacity-0 group-hover/row:opacity-100 transition-opacity" />
      </div>
      <h3 className="font-display font-bold text-slate-900 leading-tight text-base tracking-tight">{product.name}</h3>
    </div>
    <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">{product.description}</p>
  </div>
);

const ItemWrapper: React.FC<{ item: RoadmapItem, milestones: Milestone[], onEdit: () => void, onDragStart: () => void, activeQuarter?: string }> = ({ item, milestones, onEdit, onDragStart, activeQuarter = 'all' }) => {
  const span = Math.min(item.spanMonths || 1, 12 - item.startMonth);
  const startCol = activeQuarter === 'all' ? item.startMonth + 1 : (item.startMonth % 3) + 1;
  const colSpan = activeQuarter === 'all' ? span : Math.min(span, 3 - (item.startMonth % 3));

  return (
    <div
      style={{ gridColumn: `${startCol} / span ${colSpan}` }}
      className="transition-all z-10"
      draggable
      onDragStart={onDragStart}
    >
      <CleanItemCard item={item} milestones={milestones} onEdit={onEdit} />
    </div>
  );
};

const CleanItemCard: React.FC<{ item: RoadmapItem; milestones: Milestone[]; onEdit: () => void }> = ({ item, milestones, onEdit }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const isHighPriority = item.priority === Priority.HIGH;
  const completedCount = (item.subFeatures || []).filter(sf => sf.isCompleted).length;
  const totalCount = (item.subFeatures || []).length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className={`group/card mx-1 rounded-[1.25rem] border bg-white shadow-sm transition-all flex flex-col ${isHighPriority ? 'border-amber-200 ring-4 ring-amber-400/5 shadow-amber-100/20' : 'border-slate-100'} ${isExpanded ? 'z-40 shadow-2xl scale-[1.02] border-indigo-200' : 'hover:shadow-xl hover:border-indigo-100 hover:-translate-y-0.5'}`}>
      <div className="p-4 cursor-grab active:cursor-grabbing" onClick={onEdit}>
        <div className="flex justify-between items-start gap-3 mb-2">
          <h4 className="text-sm font-bold text-slate-800 leading-tight tracking-tight group-hover/card:text-indigo-600 transition-colors truncate">
            {item.title}
          </h4>
          {isHighPriority && <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />}
        </div>

        {item.milestoneId && (
          <div className="flex items-center gap-2 mb-3 bg-indigo-50/50 px-2 py-1 rounded-lg border border-indigo-100/30">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest truncate">
              {milestones.find(m => m.id === item.milestoneId)?.title || 'Milestone'}
            </span>
          </div>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {item.tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase tracking-wide">
                {tag}
              </span>
            ))}
            {item.tags.length > 2 && (
              <span className="px-1.5 py-0.5 bg-slate-200 text-slate-500 text-xs font-bold rounded">+{item.tags.length - 2}</span>
            )}
          </div>
        )}

        {totalCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div className={`h-full rounded-full transition-all duration-700 shadow-sm ${progressPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`} style={{ width: `${progressPercent}%` }}></div>
            </div>
            <span className="text-xs font-black text-slate-400 tabular-nums">{Math.round(progressPercent)}%</span>
          </div>
        )}
      </div>

      {totalCount > 0 && (
        <button onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} className="w-full flex items-center justify-center py-2 hover:bg-slate-50 transition-colors border-t border-slate-50">
          {isExpanded ? <ChevronUp className="h-4 w-4 text-indigo-400" /> : <ChevronDown className="h-4 w-4 text-slate-300 group-hover/card:text-indigo-300" />}
        </button>
      )}

      {isExpanded && (
        <div className="px-5 pb-5 pt-3 bg-slate-50/50 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-2">
            {item.subFeatures.map((sf) => (
              <div key={sf.id} className="flex items-center gap-3">
                {sf.isCompleted ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <div className="h-4 w-4 rounded-full border-2 border-slate-200" />}
                <span className={`text-sm font-medium truncate ${sf.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
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
