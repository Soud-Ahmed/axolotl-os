import { useQuery } from '@tanstack/react-query';
import * as analyticsApi from '../api/analytics';

export function useMetrics() {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: () => analyticsApi.getDashboardMetrics(),
  });
}

export function useActivityLogs() {
  return useQuery({
    queryKey: ['activity-logs'],
    queryFn: () => analyticsApi.getActivityLogs(),
  });
}
