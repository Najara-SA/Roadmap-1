
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
    <div className="max-w-5xl mx-auto py-12 px-6 space-y-12 overflow-y-auto custom-scrollbar h-full pb-32">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Cloud Infrastructure</h2>
          <p className="text-gray-500 font-medium">Gerencie sua conexão persistente com o Supabase.</p>
        </div>
        {isConfigured && (
          <button 
            onClick={clearSupabaseConfig}
            className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <Trash2 className="h-4 w-4" /> Reset Connection
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Connection Form */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className={`p-3 rounded-2xl ${isConfigured ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 leading-tight">Connection Settings</h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                  {isConfigured ? 'Persisted in Browser' : 'Configuration Required'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Project URL</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://your-project.supabase.co"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
                  />
                  <Globe className="absolute left-4 top-4 h-4 w-4 text-gray-300" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Anon / Public Key</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1Ni..."
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-mono"
                  />
                  <Key className="absolute left-4 top-4 h-4 w-4 text-gray-300" />
                </div>
              </div>

              <button 
                type="submit"
                disabled={!url || !anonKey}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3"
              >
                <Save className="h-4 w-4" /> Save and Connect
              </button>
            </form>
          </div>

          {/* SQL Editor Guide */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 leading-tight">Database Schema</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">PostgreSQL Initialization</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Após salvar a conexão acima, execute este código no <strong>SQL Editor</strong> do seu painel Supabase para criar as tabelas e políticas de segurança.
            </p>

            <div className="relative group">
              <pre className="bg-gray-900 text-gray-300 p-6 rounded-2xl text-[10px] font-mono leading-relaxed overflow-x-auto custom-scrollbar border border-gray-800">
                {SQL_COMMAND}
              </pre>
              <button 
                onClick={copySql}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all backdrop-blur-md flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Copied' : 'Copy SQL'}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className={`rounded-[2.5rem] p-8 text-white shadow-xl ${isConfigured ? 'bg-emerald-600 shadow-emerald-50' : 'bg-amber-600 shadow-amber-50'}`}>
            <Zap className="h-8 w-8 mb-6 opacity-50" />
            <h3 className="text-lg font-black mb-2 leading-tight">
              {isConfigured ? 'Cloud Sync Active' : 'Offline Mode'}
            </h3>
            <p className="text-sm mb-8 leading-relaxed opacity-80">
              {isConfigured 
                ? 'Seus dados estão sendo persistidos com segurança no Supabase e sincronizados entre sessões.'
                : 'Você está usando o cache local. Salve suas credenciais para habilitar colaboração em tempo real.'}
            </p>
            {isConfigured && (
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/20 p-3 rounded-xl border border-white/20">
                <CheckCircle2 className="h-4 w-4" /> Syncing Enabled
              </div>
            )}
          </div>
          
          <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-8">
            <div className="flex items-center gap-3 mb-4 text-indigo-700">
              <AlertTriangle className="h-5 w-5" />
              <h4 className="text-sm font-black uppercase tracking-widest">Local Persistence</h4>
            </div>
            <p className="text-xs text-indigo-800 leading-relaxed font-medium">
              Suas chaves de API são salvas apenas neste navegador (`localStorage`). Elas não são enviadas para nenhum servidor externo além do seu próprio Supabase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsView;
