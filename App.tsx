
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Sparkles, Plus, Layers, CloudCheck, RefreshCw, Database, AlertTriangle } from 'lucide-react';
import { getSupabaseClient, isSupabaseReady } from './lib/supabase';
import { localDB } from './lib/persistence';
import Sidebar from './components/Sidebar';
import RoadmapBoard from './components/RoadmapBoard';
import TimelineView from './components/TimelineView';
import PortfolioView from './components/PortfolioView';
import AnalyticsView from './components/AnalyticsView';
import IntegrationsView from './components/IntegrationsView';
import ItemModal from './components/ItemModal';
import ProductModal from './components/ProductModal';
import MilestoneModal from './components/MilestoneModal';
import AISuggestionModal from './components/AISuggestionModal';
import { RoadmapItem, RoadmapStatus, Priority, ViewType, Team, Integration, Product, Milestone } from './types';

const getQuarterFromMonth = (month: number) => `Q${Math.floor(month / 3) + 1} 2024`;

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('portfolio');
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [teams] = useState<Team[]>([
    { id: 't1', name: 'Core Backend', color: 'bg-blue-500' },
    { id: 't2', name: 'Mobile Platform', color: 'bg-purple-500' },
    { id: 't3', name: 'UX/Frontend', color: 'bg-pink-500' },
  ]);
  const [activeTeamId, setActiveTeamId] = useState<string>('all');
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'offline'>('offline');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<RoadmapItem | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | undefined>(undefined);
  const [activeContext, setActiveContext] = useState<{ productId: string, month?: number }>({ productId: '' });

  // 1. Carregar dados do Banco de Dados Local (IndexedDB) - Ultra rápido e persistente
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

  // 2. Sincronizar com a Nuvem (Supabase) se disponível
  const syncWithCloud = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setSyncStatus('offline');
      return;
    }

    setSyncStatus('syncing');
    try {
      const [pRes, iRes, mRes] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('roadmap_items').select('*'),
        supabase.from('milestones').select('*')
      ]);

      if (pRes.error || iRes.error || mRes.error) throw new Error('Cloud sync failed');

      const cloudProducts = pRes.data || [];
      const cloudItems = (iRes.data || []).map((item: any) => ({
        ...item,
        productId: item.product_id,
        teamId: item.team_id,
        subFeatures: item.sub_features || []
      }));
      const cloudMilestones = mRes.data || [];

      setProducts(cloudProducts);
      setItems(cloudItems);
      setMilestones(cloudMilestones);

      // Salvar versão da nuvem no banco local para futuras sessões offline
      await localDB.save('visionpath_data', { items: cloudItems, products: cloudProducts, milestones: cloudMilestones });
      setSyncStatus('synced');
    } catch (err) {
      setSyncStatus('error');
    }
  }, []);

  useEffect(() => {
    loadLocalData().then(() => syncWithCloud());
  }, [loadLocalData, syncWithCloud]);

  // Salva no banco local imediatamente e tenta subir para a nuvem
  const persistChanges = async (newItems: RoadmapItem[], newProducts: Product[], newMilestones: Milestone[]) => {
    // Banco Local primeiro (Segurança total)
    await localDB.save('visionpath_data', { items: newItems, products: newProducts, milestones: newMilestones });

    // Cloud Sync (Segundo plano)
    const supabase = getSupabaseClient();
    if (supabase) {
      setSyncStatus('syncing');
      // Lógica de upsert omitida por brevidade, mas o ideal seria sincronizar aqui
      // Por agora, o fetchData resolverá a consistência no próximo ciclo ou após ações
      syncWithCloud();
    }
  };

  const handleUpdateItem = async (updatedItem: RoadmapItem) => {
    const nextItems = items.some(i => i.id === updatedItem.id)
      ? items.map(i => i.id === updatedItem.id ? updatedItem : i)
      : [...items, updatedItem];

    setItems(nextItems);
    setIsModalOpen(false);

    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('roadmap_items').upsert({
        id: updatedItem.id,
        product_id: updatedItem.productId,
        team_id: updatedItem.teamId,
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
      await supabase.from('roadmap_items').delete().eq('id', id);
    }
    await persistChanges(nextItems, products, milestones);
  };

  const handleSaveProduct = async (product: Product) => {
    const nextProducts = products.some(p => p.id === product.id)
      ? products.map(p => p.id === product.id ? product : p)
      : [...products, product];

    setProducts(nextProducts);
    setIsProductModalOpen(false);

    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('products').upsert(product);
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
      await supabase.from('milestones').upsert(milestone);
    }
    await persistChanges(items, products, nextMilestones);
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden font-['Inter']">
      <Sidebar activeView={activeView} onViewChange={setActiveView} teams={teams} activeTeamId={activeTeamId} onTeamChange={setActiveTeamId} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50/20">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 z-10 shadow-sm">
          <div className="flex items-center gap-6 flex-1">
            <h1 className="text-lg font-black text-gray-900 hidden md:flex items-center gap-3 tracking-tight">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <Layers className="h-5 w-5 text-indigo-600" />
              </div>
              {activeView === 'portfolio' ? 'Strategy Matrix' : activeView === 'board' ? 'Feature Board' : activeView === 'timeline' ? 'Execution Timeline' : activeView === 'analytics' ? 'Insights' : 'Infrastructure'}
            </h1>
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search resources..." className="block w-full pl-11 pr-4 py-2.5 border border-gray-100 rounded-2xl text-[11px] font-semibold bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${syncStatus === 'synced' ? 'bg-emerald-50 border-emerald-100' :
                syncStatus === 'offline' ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-100'
              }`}>
              {syncStatus === 'syncing' ? (
                <RefreshCw className="h-3 w-3 text-indigo-500 animate-spin" />
              ) : syncStatus === 'synced' ? (
                <CloudCheck className="h-3 w-3 text-emerald-500" />
              ) : syncStatus === 'offline' ? (
                <Database className="h-3 w-3 text-gray-400" />
              ) : (
                <AlertTriangle className="h-3 w-3 text-red-500" />
              )}
              <span className={`text-[9px] font-black uppercase tracking-widest ${syncStatus === 'synced' ? 'text-emerald-600' :
                  syncStatus === 'offline' ? 'text-gray-400' : 'text-red-500'
                }`}>
                {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'synced' ? 'Supabase Live' : syncStatus === 'offline' ? 'Local Safe' : 'Conn Error'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* <button onClick={() => setIsAIModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-[0.2em] transition-colors"><Sparkles className="h-4 w-4" /> AI Lab</button> */}
              <button onClick={() => { setSelectedItem(undefined); setIsModalOpen(true); }} className="flex items-center gap-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"><Plus className="h-4 w-4" /> New Theme</button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          {activeView === 'portfolio' && <PortfolioView items={items} products={products} milestones={milestones} onEditItem={(item) => { setSelectedItem(item); setIsModalOpen(true); }} onEditProduct={(p) => { setSelectedProduct(p); setIsProductModalOpen(true); }} onEditMilestone={(m) => { setSelectedMilestone(m); setIsMilestoneModalOpen(true); }} onAddMilestone={(pid, m) => { setActiveContext({ productId: pid, month: m }); setSelectedMilestone(undefined); setIsMilestoneModalOpen(true); }} onMoveItem={(id, month) => { const item = items.find(i => i.id === id); if (item) handleUpdateItem({ ...item, startMonth: month }); }} />}
          {activeView === 'board' && <div className="p-8 h-full overflow-auto custom-scrollbar"><RoadmapBoard items={items} teams={teams} onEditItem={(item) => { setSelectedItem(item); setIsModalOpen(true); }} onMoveItem={(id, newStatus) => { const item = items.find(i => i.id === id); if (item) handleUpdateItem({ ...item, status: newStatus }) }} /></div>}
          {activeView === 'timeline' && <div className="p-8 h-full overflow-auto custom-scrollbar"><TimelineView items={items} onEditItem={(item) => { setSelectedItem(item); setIsModalOpen(true); }} /></div>}
          {activeView === 'analytics' && <div className="p-8 h-full overflow-auto custom-scrollbar"><AnalyticsView items={items} /></div>}
          {activeView === 'integrations' && <IntegrationsView integrations={[]} onToggle={() => { }} />}
        </div>
      </main>

      {isModalOpen && <ItemModal isOpen={isModalOpen} teams={teams} products={products} milestones={milestones} allItems={items} onClose={() => { setIsModalOpen(false); setSelectedItem(undefined); }} onSave={selectedItem ? handleUpdateItem : handleAddItem} onDelete={selectedItem ? () => handleDeleteItem(selectedItem.id) : undefined} item={selectedItem} />}
      {isProductModalOpen && <ProductModal isOpen={isProductModalOpen} onClose={() => { setIsProductModalOpen(false); setSelectedProduct(undefined); }} onSave={handleSaveProduct} onDelete={selectedProduct ? () => { const next = products.filter(p => p.id !== selectedProduct.id); setProducts(next); persistChanges(items, next, milestones); setIsProductModalOpen(false); } : undefined} product={selectedProduct} />}
      {isMilestoneModalOpen && <MilestoneModal isOpen={isMilestoneModalOpen} onClose={() => { setIsMilestoneModalOpen(false); setSelectedMilestone(undefined); }} onSave={handleSaveMilestone} milestone={selectedMilestone} productId={activeContext.productId} month={activeContext.month || 0} />}
      {isAIModalOpen && <AISuggestionModal onClose={() => setIsAIModalOpen(false)} onAddItems={(newItems) => { newItems.forEach(item => handleAddItem(item)); setIsAIModalOpen(false); }} />}
    </div>
  );
};

export default App;
