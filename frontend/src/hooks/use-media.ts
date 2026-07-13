import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as mediaApi from '../api/media';

export function useMediaAssets() {
  return useQuery({
    queryKey: ['media'],
    queryFn: () => mediaApi.getMediaAssets(),
  });
}

export function useUploadMediaAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mediaApi.uploadMediaAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}

export function useDeleteMediaAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mediaApi.deleteMediaAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}
