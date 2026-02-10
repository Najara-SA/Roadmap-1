
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Layers, CloudCheck, RefreshCw, Database, AlertTriangle, Languages, Briefcase } from 'lucide-react';
import { getSupabaseClient, isSupabaseReady } from './lib/supabase';
import { localDB } from './lib/persistence';
import Sidebar from './components/Sidebar';
import TimelineView from './components/TimelineView';
import PortfolioView from './components/PortfolioView';
import AnalyticsView from './components/AnalyticsView';
import ItemModal from './components/ItemModal';
import ProductModal from './components/ProductModal';
import MilestoneModal from './components/MilestoneModal';
import { RoadmapItem, RoadmapStatus, Priority, ViewType, Vertical, Product, Milestone } from './types';
import { useTranslation } from './hooks/useTranslation';

const getQuarterFromMonth = (month: number) => `Q${Math.floor(month / 3) + 1} 2024`;

const App: React.FC = () => {
  const { t, language, changeLanguage } = useTranslation();
  const [activeView, setActiveView] = useState<ViewType>('portfolio');
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [activeVerticalId, setActiveVerticalId] = useState<string>('all');
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'offline'>('offline');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<RoadmapItem | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | undefined>(undefined);
  const [activeContext, setActiveContext] = useState<{ productId: string, month?: number }>({ productId: '' });

  // 1. Carregar dados do Banco de Dados Local (IndexedDB) para carregamento instantâneo
  const loadLocalData = useCallback(async () => {
    try {
      const cached = await localDB.load('visionpath_data');
      if (cached) {
        setItems(cached.items || []);
        setProducts(cached.products || []);
        setMilestones(cached.milestones || []);
      }
    } catch (e) {
      console.error("Falha ao carregar banco local", e);
    }
  }, []);

  // 2. Sincronizar com a Nuvem (Supabase) - Fonte de Verdade
  const syncWithCloud = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setSyncStatus('offline');
      return;
    }

    setSyncStatus('syncing');
    try {
      const [pRes, iRes, mRes, tRes] = await Promise.all([
        supabase.from('products').select('*').order('name'),
        supabase.from('roadmap_items').select('*'),
        supabase.from('milestones').select('*'),
        supabase.from('teams').select('*').order('name')
      ]);

      if (pRes.error) console.error("Products error:", pRes.error);
      if (iRes.error) console.error("Items error:", iRes.error);
      if (mRes.error) console.error("Milestones error:", mRes.error);
      if (tRes.error) console.error("Teams error:", tRes.error);

      if (pRes.error || iRes.error || mRes.error || tRes.error) throw new Error('Cloud sync failed');

      const cloudVerticals = (tRes.data || []).map((t: any) => ({
        id: t.id,
        name: t.name,
        color: t.color || 'bg-slate-500'
      }));

      const cloudProducts = pRes.data || [];
      const cloudItems = (iRes.data || []).map((item: any) => ({
        ...item,
        productId: item.product_id,
        verticalId: item.team_id || item.vertical_id,
        startMonth: item.start_month,
        spanMonths: item.span_months,
        subFeatures: item.sub_features || []
      }));
      const cloudMilestones = (mRes.data || []).map((m: any) => ({
        ...m,
        productId: m.product_id
      }));

      setProducts(cloudProducts);
      setItems(cloudItems);
      setMilestones(cloudMilestones);
      setVerticals(cloudVerticals);

      // Sincroniza o local com a nuvem
      await localDB.save('visionpath_data', {
        items: cloudItems,
        products: cloudProducts,
        milestones: cloudMilestones,
        verticals: cloudVerticals
      });
      setSyncStatus('synced');
    } catch (err) {
      console.error("Cloud Error:", err);
      setSyncStatus('error');
    }
  }, []);

  useEffect(() => {
    loadLocalData().then(() => syncWithCloud());
  }, [loadLocalData, syncWithCloud]);

  const persistChanges = async (newItems: RoadmapItem[], newProducts: Product[], newMilestones: Milestone[]) => {
    // Mantém local atualizado
    await localDB.save('visionpath_data', { items: newItems, products: newProducts, milestones: newMilestones });
  };

  const handleUpdateItem = async (updatedItem: RoadmapItem) => {
    const nextItems = items.some(i => i.id === updatedItem.id)
      ? items.map(i => i.id === updatedItem.id ? updatedItem : i)
      : [...items, updatedItem];

    setItems(nextItems);
    setIsModalOpen(false);

    const supabase = getSupabaseClient();
    if (supabase) {
      setSyncStatus('syncing');
      const { error } = await supabase.from('roadmap_items').upsert({
        id: updatedItem.id,
        product_id: updatedItem.productId,
        team_id: updatedItem.verticalId,
        title: updatedItem.title,
        description: updatedItem.description,
        status: updatedItem.status,
        priority: updatedItem.priority,
        start_month: updatedItem.startMonth,
        span_months: updatedItem.spanMonths,
        effort: updatedItem.effort,
        value: updatedItem.value,
        tags: updatedItem.tags,
        sub_features: updatedItem.subFeatures,
        quarter: getQuarterFromMonth(updatedItem.startMonth)
      });

      if (error) {
        console.error("Error upserting item:", error);
        setSyncStatus('error');
      } else {
        setSyncStatus('synced');
      }
    }
    await persistChanges(nextItems, products, milestones);
  };

  const handleAddItem = async (item: any) => {
    const newItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
      quarter: getQuarterFromMonth(item.startMonth)
    };
    await handleUpdateItem(newItem);
  };

  const handleDeleteItem = async (id: string) => {
    const nextItems = items.filter(i => i.id !== id);
    setItems(nextItems);
    setIsModalOpen(false);

    const supabase = getSupabaseClient();
    if (supabase) {
      setSyncStatus('syncing');
      const { error } = await supabase.from('roadmap_items').delete().eq('id', id);
      if (error) {
        console.error("Error deleting item:", error);
        setSyncStatus('error');
      } else {
        setSyncStatus('synced');
      }
    }
    await persistChanges(nextItems, products, milestones);
  };

  const handleDeleteProduct = async (id: string) => {
    const nextProducts = products.filter(p => p.id !== id);
    setProducts(nextProducts);
    setIsProductModalOpen(false);

    const supabase = getSupabaseClient();
    if (supabase) {
      setSyncStatus('syncing');
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        console.error("Error deleting product:", error);
        setSyncStatus('error');
      } else {
        setSyncStatus('synced');
      }
    }
    await persistChanges(items, nextProducts, milestones);
  };

  const handleSaveProduct = async (product: Product) => {
    const isNew = !products.some(p => p.id === product.id);
    const nextProducts = !isNew
      ? products.map(p => p.id === product.id ? product : p)
      : [...products, product];

    setProducts(nextProducts);
    setIsProductModalOpen(false);

    const supabase = getSupabaseClient();
    if (supabase) {
      setSyncStatus('syncing');
      const { error } = await supabase.from('products').upsert(product);
      if (error) {
        console.error("Error upserting product:", error);
        setSyncStatus('error');
      } else {
        setSyncStatus('synced');
      }
    }
    await persistChanges(items, nextProducts, milestones);
  };

  const handleSaveMilestone = async (milestone: Milestone) => {
    const nextMilestones = milestones.some(m => m.id === milestone.id)
      ? milestones.map(m => m.id === milestone.id ? milestone : m)
      : [...milestones, milestone];

    setMilestones(nextMilestones);
    setIsMilestoneModalOpen(false);

    const supabase = getSupabaseClient();
    if (supabase) {
      setSyncStatus('syncing');
      const { error } = await supabase.from('milestones').upsert({
        id: milestone.id,
        product_id: milestone.productId,
        title: milestone.title,
        month: milestone.month,
        description: milestone.description
      });
      if (error) {
        console.error("Error upserting milestone:", error);
        setSyncStatus('error');
      } else {
        setSyncStatus('synced');
      }
    }
    await persistChanges(items, products, nextMilestones);
  };

  const handleSaveVertical = async (vertical: Vertical) => {
    const isNew = !verticals.some(v => v.id === vertical.id);
    const nextVerticals = !isNew
      ? verticals.map(v => v.id === vertical.id ? vertical : v)
      : [...verticals, vertical];

    setVerticals(nextVerticals);

    const supabase = getSupabaseClient();
    if (supabase) {
      setSyncStatus('syncing');
      const { error } = await supabase.from('teams').upsert({
        id: vertical.id,
        name: vertical.name,
        color: vertical.color
      });
      if (error) {
        console.error("Error upserting vertical:", error);
        setSyncStatus('error');
      } else {
        setSyncStatus('synced');
      }
    }
    await localDB.save('visionpath_data', { items, products, milestones, verticals: nextVerticals });
  };

  const handleDeleteVertical = async (id: string) => {
    const nextVerticals = verticals.filter(v => v.id !== id);
    setVerticals(nextVerticals);
    if (activeVerticalId === id) setActiveVerticalId('all');

    const supabase = getSupabaseClient();
    if (supabase) {
      setSyncStatus('syncing');
      const { error } = await supabase.from('teams').delete().eq('id', id);
      if (error) {
        console.error("Error deleting vertical:", error);
        setSyncStatus('error');
      } else {
        setSyncStatus('synced');
      }
    }
    await localDB.save('visionpath_data', { items, products, milestones, verticals: nextVerticals });
  };

  return (
    <div className="flex h-screen bg-slate-50/30 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        verticals={verticals}
        activeVerticalId={activeVerticalId}
        onVerticalChange={setActiveVerticalId}
        onAddVertical={handleSaveVertical}
        onDeleteVertical={handleDeleteVertical}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-8 z-20 sticky top-0">
          <div className="flex items-center gap-8 flex-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-lg shadow-indigo-200/50">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-display font-bold text-slate-900 tracking-tight">
                {activeView === 'portfolio' ? t('strategyMatrix') : activeView === 'timeline' ? t('executionTimeline') : t('insights')}
              </h1>
            </div>

            <div className="relative max-w-sm w-full hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={t('searchPlaceHolder')}
                className="block w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-2xl text-sm font-medium bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border transition-all ${syncStatus === 'synced' ? 'bg-emerald-50 border-emerald-100/50 text-emerald-700' :
              syncStatus === 'offline' ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-red-50 border-red-100 text-red-700'
              }`}>
              {syncStatus === 'syncing' ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : syncStatus === 'synced' ? (
                <CloudCheck className="h-3.5 w-3.5" />
              ) : syncStatus === 'offline' ? (
                <Database className="h-3.5 w-3.5" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5" />
              )}
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                {syncStatus === 'syncing' ? t('syncing') : syncStatus === 'synced' ? t('supabaseLive') : syncStatus === 'offline' ? t('localSafe') : t('connError')}
              </span>
            </div>

            <div className="h-8 w-px bg-slate-200 mx-2"></div>

            <div className="flex items-center bg-slate-100/50 p-1 rounded-xl border border-slate-200/60">
              {(['pt', 'es', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all uppercase tracking-wider ${language === lang
                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { setSelectedProduct(undefined); setIsProductModalOpen(true); }}
                className="flex items-center gap-2 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 rounded-2xl hover:border-indigo-100 transition-all active:scale-95 shadow-sm"
              >
                <Briefcase className="h-4 w-4" />
                {t('newProduct')}
              </button>

              <button
                onClick={() => { setSelectedItem(undefined); setIsModalOpen(true); }}
                className="group flex items-center gap-2 px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 active:shadow-none"
              >
                <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                {t('newTheme')}
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          {activeView === 'portfolio' && <PortfolioView items={items} products={products} milestones={milestones} onEditItem={(item) => { setSelectedItem(item); setIsModalOpen(true); }} onEditProduct={(p) => { setSelectedProduct(p); setIsProductModalOpen(true); }} onEditMilestone={(m) => { setSelectedMilestone(m); setIsMilestoneModalOpen(true); }} onAddMilestone={(pid, m) => { setActiveContext({ productId: pid, month: m }); setSelectedMilestone(undefined); setIsMilestoneModalOpen(true); }} onMoveItem={(id, month) => { const item = items.find(i => i.id === id); if (item) handleUpdateItem({ ...item, startMonth: month }); }} />}
          {activeView === 'timeline' && <div className="p-8 h-full overflow-auto custom-scrollbar"><TimelineView items={items} onEditItem={(item) => { setSelectedItem(item); setIsModalOpen(true); }} /></div>}
          {activeView === 'analytics' && <div className="p-8 h-full overflow-auto custom-scrollbar"><AnalyticsView items={items} /></div>}
        </div>
      </main>

      {isModalOpen && <ItemModal isOpen={isModalOpen} verticals={verticals} products={products} milestones={milestones} allItems={items} onClose={() => { setIsModalOpen(false); setSelectedItem(undefined); }} onSave={selectedItem ? handleUpdateItem : handleAddItem} onDelete={selectedItem ? () => handleDeleteItem(selectedItem.id) : undefined} item={selectedItem} />}
      {isProductModalOpen && <ProductModal isOpen={isProductModalOpen} onClose={() => { setIsProductModalOpen(false); setSelectedProduct(undefined); }} onSave={handleSaveProduct} onDelete={selectedProduct ? () => handleDeleteProduct(selectedProduct.id) : undefined} product={selectedProduct} />}
      {isMilestoneModalOpen && <MilestoneModal isOpen={isMilestoneModalOpen} onClose={() => { setIsMilestoneModalOpen(false); setSelectedMilestone(undefined); }} onSave={handleSaveMilestone} onDelete={selectedMilestone ? async () => {
        const next = milestones.filter(m => m.id !== selectedMilestone.id);
        setMilestones(next);
        setIsMilestoneModalOpen(false);
        const supabase = getSupabaseClient();
        if (supabase) {
          setSyncStatus('syncing');
          const { error } = await supabase.from('milestones').delete().eq('id', selectedMilestone.id);
          if (error) { console.error("Error deleting milestone:", error); setSyncStatus('error'); }
          else setSyncStatus('synced');
        }
        await persistChanges(items, products, next);
      } : undefined} milestone={selectedMilestone} productId={activeContext.productId} month={activeContext.month || 0} />}
    </div>
  );
};

export default App;
