import { useQuery } from "@tanstack/react-query";
import { api } from "@lib/api";
import { ENDPOINTS } from "@lib/api/endpoints";
import { PaginatedResponse, NotificationItem } from "@types";

export function useNotifications(
  params: { page?: number; limit?: number; is_read?: boolean } = {},
) {
  return useQuery<PaginatedResponse<NotificationItem>>({
    queryKey: ["notifications", params],
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
