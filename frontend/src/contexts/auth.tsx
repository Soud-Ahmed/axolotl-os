import { useEffect, useCallback, type ReactNode } from 'react';
import { AuthContext } from './auth-context';
import { useAuthStore } from '../store/auth';
import { useToastStore } from '../store/toast';
import { supabase } from '../lib/supabase';
import { User, UserRole } from '../types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const addToast = useToastStore((s) => s.addToast);

  // Network offline/online listeners
  useEffect(() => {
    const handleOnline = () => addToast('Network connection restored. Back online.', 'success');
    const handleOffline = () => addToast('Network connection lost. Working offline.', 'warning', 0);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addToast]);

  const initialize = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        const userObj: User = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || '',
          fullName: session.user.user_metadata?.name || '',
          role: (session.user.user_metadata?.role as UserRole) || 'client',
          avatarUrl: session.user.user_metadata?.avatar_url || null,
          companyName: session.user.user_metadata?.companyName || 'Axolotl Web Media',
          status: session.user.user_metadata?.status || 'active',
          createdAt: session.user.created_at,
          updatedAt: session.user.updated_at || session.user.created_at,
        };
        setUser(userObj);
        localStorage.setItem('accessToken', session.access_token);
        localStorage.setItem('refreshToken', session.refresh_token || '');
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  useEffect(() => {
    // Listen for auth state changes (e.g. login, signout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session && session.user) {
        const userObj: User = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || '',
          fullName: session.user.user_metadata?.name || '',
          role: (session.user.user_metadata?.role as UserRole) || 'client',
          avatarUrl: session.user.user_metadata?.avatar_url || null,
          companyName: session.user.user_metadata?.companyName || 'Axolotl Web Media',
          status: session.user.user_metadata?.status || 'active',
          createdAt: session.user.created_at,
          updatedAt: session.user.updated_at || session.user.created_at,
        };
        setUser(userObj);
        localStorage.setItem('accessToken', session.access_token);
        localStorage.setItem('refreshToken', session.refresh_token || '');
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      }
      setLoading(false);
    });

    initialize();

    return () => {
      subscription.unsubscribe();
    };
  }, [initialize, setUser, setLoading]);

  return (
    <AuthContext.Provider value={{ initialize }}>
      {children}
    </AuthContext.Provider>
  );
}
