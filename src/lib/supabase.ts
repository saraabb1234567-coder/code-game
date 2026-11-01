// Supabase Client configuration and interface readiness

export interface SupabaseConfig {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

// In standard build or when environment variables are injected
export const getSupabaseConfig = (): SupabaseConfig => {
  return {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  };
};

export const isSupabaseConfigured = (): boolean => {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  return Boolean(supabaseUrl && supabaseAnonKey);
};
