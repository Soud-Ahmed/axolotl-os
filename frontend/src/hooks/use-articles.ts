import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as articlesApi from '../api/articles';

export function useArticles() {
  return useQuery({
    queryKey: ['articles'],
    queryFn: () => articlesApi.getArticles(),
  });
}

export function useArticle(id: string) {
  return useQuery({
    queryKey: ['articles', id],
    queryFn: () => articlesApi.getArticleById(id),
    enabled: !!id,
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: articlesApi.createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Parameters<typeof articlesApi.updateArticle>[1] }) =>
      articlesApi.updateArticle(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['articles', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: articlesApi.deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}

export function useArticleComments(articleId: string) {
  return useQuery({
    queryKey: ['articles', articleId, 'comments'],
    queryFn: () => articlesApi.getArticleComments(articleId),
    enabled: !!articleId,
  });
}

export function useCreateArticleComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ articleId, content }: { articleId: string; content: string }) =>
      articlesApi.createArticleComment(articleId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['articles', variables.articleId, 'comments'] });
    },
  });
}
