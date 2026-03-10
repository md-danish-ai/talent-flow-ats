import { api } from "./index";

export type MatchDetails = {
  new_user: {
    name: string;
    dob: string;
    father: string;
    mother: string;
    created_at?: string;
    education?: string;
    work?: string;
    city?: string;
  };
  matched_user: {
    name: string;
    dob: string;
    father: string;
    mother: string;
    created_at?: string;
    education?: string;
    work?: string;
    city?: string;
  };
  scores?: {
    name: number;
    dob: number;
    father: number;
    mother: number;
    personal?: number;
    education?: number;
    work?: number;
  };
};

export type NotificationItem = {
  id: number;
  type: string;
  reference_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  match_details?: MatchDetails;
  final_score?: number;
};

import { type PaginatedResponse } from "./types";

export type NotificationResponse = PaginatedResponse<NotificationItem> & {
  read_count: number;
  unread_count: number;
};

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
  return api.get<NotificationResponse>(`/notifications/getall${queryString}`);
};

export const markNotificationsRead = (notification_ids: number[]) =>
  api.post<{ message: string }>("/notifications/read", { notification_ids });

export const markNotificationsUnread = (notification_ids: number[]) =>
  api.post<{ message: string }>("/notifications/unread", { notification_ids });
