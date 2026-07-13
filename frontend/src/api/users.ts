import { apiClient } from './client';
import type { User } from '../types';

export async function getUsers(): Promise<User[]> {
  return apiClient.get<User[]>('/users');
}

export async function getUserById(id: string): Promise<User> {
  return apiClient.get<User>(`/users/${id}`);
}

export async function updateUserProfile(id: string, data: { name?: string; fullName?: string; avatarUrl?: string; role?: string }): Promise<User> {
  // Map fullName to name since backend expects name
  const backendData = {
    name: data.name || data.fullName,
    avatarUrl: data.avatarUrl,
    role: data.role
  };
  return apiClient.put<User>(`/users/${id}`, backendData);
}
