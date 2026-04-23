import { api } from "./index";
import { ENDPOINTS } from "./endpoints";
import { NotificationResponse } from "@types";

export const getAllNotifications = (params?: {
  page?: number;
  limit?: number;
  sort_by?: string;
  order?: string;
  search?: string;
  is_read?: boolean;
}) => {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", params.page.toString());
  if (params?.limit) query.append("limit", params.limit.toString());
  if (params?.sort_by) query.append("sort_by", params.sort_by);
  if (params?.order) query.append("order", params.order);
  if (params?.search) query.append("search", params.search);
  if (params?.is_read !== undefined)
    query.append("is_read", params.is_read.toString());

  const queryString = query.toString() ? `?${query.toString()}` : "";
  return api.get<NotificationResponse>(
    `${ENDPOINTS.NOTIFICATIONS.GET}${queryString}`,
  );
};

export const markNotificationsRead = (notification_ids: number[]) =>
  api.post<{ message: string }>(ENDPOINTS.NOTIFICATIONS.READ, {
    notification_ids,
  });

export const markNotificationsUnread = (notification_ids: number[]) =>
  api.post<{ message: string }>(ENDPOINTS.NOTIFICATIONS.UNREAD, {
    notification_ids,
  });
