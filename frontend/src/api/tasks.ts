import { apiClient } from './client';
import { Task, Comment } from '../types';

export async function getTasks(): Promise<Task[]> {
  return apiClient.get<Task[]>('/tasks');
}

export async function getTaskById(id: string): Promise<Task> {
  return apiClient.get<Task>(`/tasks/${id}`);
}

export async function createTask(input: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'assignee' | 'reporter'>): Promise<Task> {
  return apiClient.post<Task>('/tasks', input);
}

export async function updateTask(id: string, input: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'assignee' | 'reporter'>>): Promise<Task> {
  return apiClient.put<Task>(`/tasks/${id}`, input);
}

export async function deleteTask(id: string): Promise<void> {
  return apiClient.delete<void>(`/tasks/${id}`);
}

export async function getTaskComments(taskId: string): Promise<Comment[]> {
  return apiClient.get<Comment[]>(`/tasks/${taskId}/comments`);
}

export async function createTaskComment(taskId: string, content: string): Promise<Comment> {
  return apiClient.post<Comment>(`/tasks/${taskId}/comments`, { content });
}
