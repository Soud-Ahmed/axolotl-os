import { apiClient } from './client';
import { Article, Comment } from '../types';

export async function getArticles(): Promise<Article[]> {
  return apiClient.get<Article[]>('/articles');
}

export async function getArticleById(id: string): Promise<Article> {
  return apiClient.get<Article>(`/articles/${id}`);
}

export async function createArticle(input: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'author'>): Promise<Article> {
  return apiClient.post<Article>('/articles', input);
}

export async function updateArticle(id: string, input: Partial<Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'author'>>): Promise<Article> {
  return apiClient.put<Article>(`/articles/${id}`, input);
}

export async function deleteArticle(id: string): Promise<void> {
  return apiClient.delete<void>(`/articles/${id}`);
}

export async function getArticleComments(articleId: string): Promise<Comment[]> {
  return apiClient.get<Comment[]>(`/articles/${articleId}/comments`);
}

export async function createArticleComment(articleId: string, content: string): Promise<Comment> {
  return apiClient.post<Comment>(`/articles/${articleId}/comments`, { content });
}
