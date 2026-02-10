
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Nota de Segurança:
 * O uso de process.env é a maneira correta e segura de lidar com chaves.
 * Se o seu ambiente reseta os arquivos, configure estas variáveis no 
 * painel de controle da plataforma (Secrets/Env Vars).
 */

const STORAGE_KEY_URL = 'visionpath_supabase_url';
const STORAGE_KEY_KEY = 'visionpath_supabase_key';

// Fix: Add getSupabaseConfig to handle environment and local storage settings
export const getSupabaseConfig = () => {
  return {
    url: localStorage.getItem(STORAGE_KEY_URL) || (import.meta as any).env?.VITE_SUPABASE_URL || '',
    key: localStorage.getItem(STORAGE_KEY_KEY) || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '',
  };
};

// Fix: Add saveSupabaseConfig to allow users to persist their own connection details
export const saveSupabaseConfig = (url: string, key: string) => {
  localStorage.setItem(STORAGE_KEY_URL, url);
  localStorage.setItem(STORAGE_KEY_KEY, key);
  window.location.reload();
};

// Fix: Add clearSupabaseConfig to reset connection to defaults
export const clearSupabaseConfig = () => {
  localStorage.removeItem(STORAGE_KEY_URL);
  localStorage.removeItem(STORAGE_KEY_KEY);
  window.location.reload();
};

// Fix: Add isSupabaseConfigured to check if valid configuration exists
export const isSupabaseConfigured = () => {
  const { url, key } = getSupabaseConfig();
  return !!url && !!key && !url.includes('PLACEHOLDER');
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = () => {
  if (clientInstance) return clientInstance;

  // Fix: Use config from helper which checks both env and storage
  const { url, key } = getSupabaseConfig();

  // Validação básica para evitar que o app quebre se as chaves não existirem
  if (!url || !key || url.includes('PLACEHOLDER')) {
    return null;
  }

  try {
    clientInstance = createClient(url, key);
    return clientInstance;
  } catch (e) {
    console.error("Erro ao inicializar Supabase:", e);
    return null;
  }
};

export const isSupabaseReady = () => {
  const client = getSupabaseClient();
  return client !== null;
};
