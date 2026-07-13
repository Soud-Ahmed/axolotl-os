import { apiClient } from './client';
import { DashboardMetrics, ActivityLog } from '../types';

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return apiClient.get<DashboardMetrics>('/analytics/metrics');
}

export async function getActivityLogs(): Promise<ActivityLog[]> {
  return apiClient.get<ActivityLog[]>('/analytics/activity');
}
