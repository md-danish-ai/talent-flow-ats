import { useQuery } from '@tanstack/react-query';
import { api } from '@lib/api';
import { ENDPOINTS } from '@lib/api/endpoints';
import { type PaginatedResponse } from '@lib/api/types';

export interface NotificationItem {
  id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  final_score?: number;
  match_details?: {
    new_user: Record<string, unknown>;
    matched_user: Record<string, unknown>;
    scores: Record<string, unknown>;
  };
}

export function useNotifications(params: { page?: number; limit?: number; is_read?: boolean } = {}) {
  return useQuery<PaginatedResponse<NotificationItem>>({
    queryKey: ['notifications', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }
      const queryString = queryParams.toString();
      const endpoint = `${ENDPOINTS.NOTIFICATIONS.GET}${queryString ? `?${queryString}` : ""}`;
      return await api.get(endpoint);
    },
  });
}
