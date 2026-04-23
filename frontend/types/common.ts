export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  order?: "asc" | "desc";
}

export interface ApiResponsePagination {
  total_records: number;
  total_pages: number;
  current_page: number;
  per_page: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: ApiResponsePagination;
}

export interface IApiError {
  message: string;
  status_code?: number;
  errors?: Record<string, string[]>;
}
