import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { supabase, supabaseAuth } from '../lib/supabase';
import { User, UserRole } from '../types';

export function useSignUp() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  return useMutation({
    mutationFn: async ({ email, password, fullName, role = 'client' }: { email: string; password: string; fullName: string; role?: string }) => {
      const data = await supabaseAuth.signUp(email, password, fullName, role);
      return data;
    },
    onSuccess: (data) => {
      // If email confirmation is required, they might not get a session immediately.
      if (data.session) {
        localStorage.setItem('accessToken', data.session.access_token);
        localStorage.setItem('refreshToken', data.session.refresh_token || '');
        
        const userObj: User = {
          id: data.user!.id,
          email: data.user!.email!,
          name: data.user!.user_metadata?.name || '',
          fullName: data.user!.user_metadata?.name || '',
          role: (data.user!.user_metadata?.role as UserRole) || 'client',
          avatarUrl: data.user!.user_metadata?.avatar_url || null,
          companyName: data.user!.user_metadata?.companyName || 'Axolotl Web Media',
          status: data.user!.user_metadata?.status || 'active',
          createdAt: data.user!.created_at,
          updatedAt: data.user!.updated_at || data.user!.created_at,
        };
        setUser(userObj);
        navigate('/dashboard');
      } else {
        // If email confirmation is required, redirect to verification instructions page
        navigate('/verify-email', { state: { email: data.user?.email } });
      }
      setLoading(false);
    },
  });
}

export function useSignIn() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  return useMutation({
    mutationFn: async ({ email, password, rememberMe = true }: { email: string; password: string; rememberMe?: boolean }) => {
      const data = await supabaseAuth.signIn(email, password);
      return { data, rememberMe };
    },
    onSuccess: ({ data, rememberMe }) => {
      if (data.session) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('accessToken', data.session.access_token);
        storage.setItem('refreshToken', data.session.refresh_token || '');
        
        // Also save in localStorage standard keys for AuthProvider loading check
        localStorage.setItem('accessToken', data.session.access_token);
        localStorage.setItem('refreshToken', data.session.refresh_token || '');

        const userObj: User = {
          id: data.user!.id,
          email: data.user!.email!,
          name: data.user!.user_metadata?.name || '',
          fullName: data.user!.user_metadata?.name || '',
          role: (data.user!.user_metadata?.role as UserRole) || 'client',
          avatarUrl: data.user!.user_metadata?.avatar_url || null,
          companyName: data.user!.user_metadata?.companyName || 'Axolotl Web Media',
          status: data.user!.user_metadata?.status || 'active',
          createdAt: data.user!.created_at,
          updatedAt: data.user!.updated_at || data.user!.created_at,
        };
        setUser(userObj);
        navigate('/dashboard');
      }
      setLoading(false);
    },
  });
}

export function useSignOut() {
  const navigate = useNavigate();
  const clear = useAuthStore((s) => s.clear);

  return useMutation({
    mutationFn: async () => {
      await supabaseAuth.signOut();
    },
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      clear();
      navigate('/login');
    },
    onError: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      clear();
      navigate('/login');
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    },
  });
}

export function useResetPassword() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (password: string) => {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
    },
    onSuccess: () => {
      navigate('/login');
    },
  });
}
