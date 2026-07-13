import { apiClient } from './client';
import type { User, AuthSession, SignUpInput, SignInInput } from '../types/auth';

export async function signUp(input: SignUpInput): Promise<AuthSession> {
  return apiClient.post<AuthSession>('/auth/signup', input);
}

export async function signIn(input: SignInInput): Promise<AuthSession> {
  return apiClient.post<AuthSession>('/auth/signin', input);
}

export async function signOut(): Promise<void> {
  return apiClient.post<void>('/auth/signout');
}

export async function getCurrentUser(): Promise<User> {
  return apiClient.get<User>('/auth/me');
}
