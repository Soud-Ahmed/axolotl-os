export const config = {
  appName: 'Axolotl-OS',
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
} as const;
