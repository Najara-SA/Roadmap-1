
import React, { useState, useEffect } from 'react';
import { Integration } from '../types';
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Zap,
  Database,
  Copy,
  Check,
  Key,
  Globe,
  Save,
  Trash2
} from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig, clearSupabaseConfig, isSupabaseConfigured } from '../lib/supabase';
import { useTranslation } from '../hooks/useTranslation';

interface IntegrationsViewProps {
  integrations: Integration[];
  onToggle: (id: 'jira' | 'trello') => void;
}

const SQL_COMMAND = `-- 1. CRIAR AS TABELAS
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT
);

CREATE TABLE IF NOT EXISTS roadmap_items (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  team_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT,
  priority TEXT,
  start_month INTEGER,
  span_months INTEGER,
  effort INTEGER,
  value INTEGER,
  tags TEXT[],
  sub_features JSONB DEFAULT '[]',
  quarter TEXT,
  created_at BIGINT
);

CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY,
  productId TEXT REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  month INTEGER,
  description TEXT
);

-- 2. ATIVAR SEGURANÇA (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- 3. CRIAR POLÍTICAS DE ACESSO (PERMITIR TUDO PARA DESENVOLVIMENTO)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access') THEN
        CREATE POLICY "Public Access" ON products FOR ALL USING (true) WITH CHECK (true);
        CREATE POLICY "Public Access" ON roadmap_items FOR ALL USING (true) WITH CHECK (true);
        CREATE POLICY "Public Access" ON milestones FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;`;

const IntegrationsView: React.FC<IntegrationsViewProps> = ({ integrations, onToggle }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const config = getSupabaseConfig();
    setUrl(config.url);
    setAnonKey(config.key);
    setIsConfigured(isSupabaseConfigured());
  }, []);

  const copySql = () => {
    navigator.clipboard.writeText(SQL_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && anonKey) {
      saveSupabaseConfig(url, anonKey);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-16 px-10 space-y-16 overflow-y-auto custom-scrollbar h-full pb-32 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex justify-between items-end border-b border-slate-100 pb-10">
        <div>
          <h2 className="text-5xl font-display font-black text-slate-900 tracking-tight mb-4">{t('cloudInfra')}</h2>
          <p className="text-xl text-slate-500 font-medium">{t('manageConnection')}</p>
        </div>
        {isConfigured && (
          <button
            onClick={clearSupabaseConfig}
            className="flex items-center gap-2.5 px-6 py-3 text-[12px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 rounded-[1.25rem] transition-all border border-transparent hover:border-rose-100"
          >
            <Trash2 className="h-5 w-5" /> Reset Connection
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          {/* Connection Form */}
          <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="flex items-center gap-5 mb-10">
              <div className={`p-4 rounded-[1.5rem] shadow-lg ${isConfigured ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                <Globe className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-black text-slate-900 leading-tight">{t('connectionSettings')}</h3>
                <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">
                  {isConfigured ? t('activeSync') : t('offlineMode')}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-8">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Project URL</label>
                <div className="relative">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://your-project.supabase.co"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-200 rounded-[1.5rem] text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all shadow-sm"
                  />
                  <Globe className="absolute left-5 top-5 h-6 w-6 text-slate-300" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Anon / Public Key</label>
                <div className="relative">
                  <input
                    type="password"
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1Ni..."
                    className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-200 rounded-[1.5rem] text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-mono shadow-sm"
                  />
                  <Key className="absolute left-5 top-5 h-6 w-6 text-slate-300" />
                </div>
              </div>

              <button
                type="submit"
                disabled={!url || !anonKey}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-[1.5rem] text-[13px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-4 mt-4"
              >
                <Save className="h-5 w-5" /> {t('saveConnect')}
              </button>
            </form>
          </div>

          {/* SQL Editor Guide */}
          <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="flex items-center gap-5 mb-8">
              <div className="p-4 bg-slate-50 rounded-[1.5rem] text-slate-400">
                <Database className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-black text-slate-900 leading-tight">{t('dbSchema')}</h3>
                <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">PostgreSQL Initialization</p>
              </div>
            </div>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
              {t('sqlGuide')}
            </p>

            <div className="relative group">
              <pre className="bg-slate-900 text-slate-300 p-8 rounded-[2rem] text-[11px] font-mono leading-relaxed overflow-x-auto custom-scrollbar border border-slate-800 shadow-2xl">
                {SQL_COMMAND}
              </pre>
              <button
                onClick={copySql}
                className="absolute top-6 right-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all backdrop-blur-md flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-white/10"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy SQL'}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className={`rounded-[3rem] p-10 text-white shadow-2xl transition-all duration-700 hover:scale-[1.02] ${isConfigured ? 'bg-emerald-600 shadow-emerald-100/50' : 'bg-amber-600 shadow-amber-100/50'}`}>
            <Zap className="h-12 w-12 mb-8 opacity-50" />
            <h3 className="text-3xl font-display font-black mb-4 leading-tight">
              {isConfigured ? t('activeSync') : t('offlineMode')}
            </h3>
            <p className="text-lg mb-10 leading-relaxed font-medium opacity-90">
              {isConfigured
                ? 'Seus dados estão sendo persistidos com segurança no Supabase e sincronizados entre sessões.'
                : 'Você está usando o cache local. Salve suas credenciais para habilitar colaboração em tempo real.'}
            </p>
            {isConfigured && (
              <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-sm">
                <CheckCircle2 className="h-5 w-5" /> Syncing Enabled
              </div>
            )}
          </div>

          <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-[3rem] p-10 hover:bg-indigo-50 transition-colors duration-500">
            <div className="flex items-center gap-4 mb-6 text-indigo-700">
              <AlertTriangle className="h-6 w-6" />
              <h4 className="text-[12px] font-black uppercase tracking-[0.2em]">Local Persistence</h4>
            </div>
            <p className="text-base text-indigo-800 leading-relaxed font-bold opacity-80">
              Suas chaves de API são salvas apenas neste navegador (`localStorage`). Elas não são enviadas para nenhum servidor externo além do seu próprio Supabase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsView;
