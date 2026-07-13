import { apiClient } from './client';
import { MediaAsset } from '../types';

export async function getMediaAssets(): Promise<MediaAsset[]> {
  return apiClient.get<MediaAsset[]>('/media');
}

export async function uploadMediaAsset(input: { fileName: string; fileType: string; base64Data: string }): Promise<MediaAsset> {
  return apiClient.post<MediaAsset>('/media/upload', input);
}

export async function deleteMediaAsset(id: string): Promise<void> {
  return apiClient.delete<void>(`/media/${id}`);
}
