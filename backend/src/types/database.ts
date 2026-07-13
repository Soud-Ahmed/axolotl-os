// Reserved for future Supabase type generation
// Run: supabase gen types typescript --linked > src/types/database.ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
