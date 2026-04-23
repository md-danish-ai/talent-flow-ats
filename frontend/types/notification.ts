import { PaginatedResponse } from "./common";

export interface MatchDetails {
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
}

export interface NotificationItem {
  id: number;
  type: string;
  reference_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  match_details?: MatchDetails;
  final_score?: number;
}

export interface NotificationResponse extends PaginatedResponse<NotificationItem> {
  read_count: number;
  unread_count: number;
}
