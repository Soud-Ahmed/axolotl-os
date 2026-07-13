import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { config } from '../config';

const supabaseUrl = config.supabaseUrl;
const supabaseAnonKey = config.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

// 1. Centralized Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2. Authentication Helper Functions
export const supabaseAuth = {
  async signUp(email: string, password: string, name: string, role: string = 'client') {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });
      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Supabase Auth SignUp Error:', err.message || err);
      throw err;
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Supabase Auth SignIn Error:', err.message || err);
      throw err;
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err: any) {
      console.error('Supabase Auth SignOut Error:', err.message || err);
      throw err;
    }
  },

  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (err: any) {
      console.error('Supabase Auth getSession Error:', err.message || err);
      throw err;
    }
  },
};

// 3. Database Helper Functions
export const supabaseDb = {
  async select<T = any>(table: string, columns: string = '*', filter?: { column: string; value: any }): Promise<T[]> {
    try {
      let query = supabase.from(table).select(columns);
      if (filter) {
        query = query.eq(filter.column, filter.value);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data as T[]) || [];
    } catch (err: any) {
      console.error(`Supabase DB Select Error on table ${table}:`, err.message || err);
      throw err;
    }
  },

  async insert<T = any>(table: string, payload: any): Promise<T> {
    try {
      const { data, error } = await supabase.from(table).insert(payload).select().single();
      if (error) throw error;
      return data as T;
    } catch (err: any) {
      console.error(`Supabase DB Insert Error on table ${table}:`, err.message || err);
      throw err;
    }
  },

  async update<T = any>(table: string, id: string, payload: any): Promise<T> {
    try {
      const { data, error } = await supabase.from(table).update(payload).eq('id', id).select().single();
      if (error) throw error;
      return data as T;
    } catch (err: any) {
      console.error(`Supabase DB Update Error on table ${table}:`, err.message || err);
      throw err;
    }
  },

  async delete(table: string, id: string): Promise<void> {
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.error(`Supabase DB Delete Error on table ${table}:`, err.message || err);
      throw err;
    }
  },
};

// 4. Storage Helper Functions
export const supabaseStorage = {
  async uploadFile(bucket: string, filePath: string, file: File): Promise<string> {
    try {
      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });
      if (error) throw error;
      return data.path;
    } catch (err: any) {
      console.error(`Supabase Storage Upload Error in bucket ${bucket}:`, err.message || err);
      throw err;
    }
  },

  getPublicUrl(bucket: string, filePath: string): string {
    try {
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err: any) {
      console.error(`Supabase Storage Public URL Error:`, err.message || err);
      throw err;
    }
  },

  async deleteFile(bucket: string, filePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([filePath]);
      if (error) throw error;
    } catch (err: any) {
      console.error(`Supabase Storage Delete Error:`, err.message || err);
      throw err;
    }
  },
};

// 5. Realtime Helper Functions
export const supabaseRealtime = {
  subscribeToTable(
    table: string,
    callback: (payload: any) => void,
    event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*'
  ): RealtimeChannel {
    try {
      const channel = supabase
        .channel(`public:${table}`)
        .on(
          'postgres_changes',
          {
            event,
            schema: 'public',
            table,
          },
          (payload) => callback(payload)
        )
        .subscribe();
      return channel;
    } catch (err: any) {
      console.error(`Supabase Realtime Subscription Error on table ${table}:`, err.message || err);
      throw err;
    }
  },

  unsubscribe(channel: RealtimeChannel): void {
    try {
      supabase.removeChannel(channel);
    } catch (err: any) {
      console.error('Supabase Realtime Unsubscribe Error:', err.message || err);
    }
  },
};
