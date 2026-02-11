
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get config exclusively from environment variables
export const getSupabaseConfig = () => {
  return {
    url: (import.meta as any).env?.VITE_SUPABASE_URL || '',
    key: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '',
  };
};

export const isSupabaseConfigured = () => {
  const { url, key } = getSupabaseConfig();
  return !!url && !!key && !url.includes('PLACEHOLDER');
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = () => {
  if (clientInstance) return clientInstance;

  const { url, key } = getSupabaseConfig();

  if (!url || !key || url.includes('PLACEHOLDER')) {
    console.warn("Supabase não configurado no .env");
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
  return getSupabaseClient() !== null;
};

// Placeholder for legacy interface compatibility during refactor
export const saveSupabaseConfig = () => { };
export const clearSupabaseConfig = () => { };

export const checkConnection = async (): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const { error } = await client.from('roadmap_items').select('count', { count: 'exact', head: true });
    if (error) {
      console.warn("Supabase connection check failed:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Supabase connection check exception:", e);
    return false;
  }
};
