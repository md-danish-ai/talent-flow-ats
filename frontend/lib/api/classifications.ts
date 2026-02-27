import { api, type ApiRequestOptions } from "./index";

export interface Classification {
  id: number;
  code: string;
  type: string;
  name: string;
  metadata?: Record<string, unknown>;
  sort_order?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedClassificationsResponse {
  data: Classification[];
  pagination: {
    total_records: number;
    total_pages: number;
    current_page: number;
    per_page: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export interface ClassificationCreate {
  type: string;
  name: string;
  code?: string;
  metadata?: Record<string, unknown>;
  sort_order?: number;
  is_active?: boolean;
}

export interface ClassificationUpdate {
  name?: string;
  metadata?: Record<string, unknown>;
  sort_order?: number;
  is_active?: boolean;
  type?: string;
  code?: string;
}

export const classificationsApi = {
  getClassifications: async (
    params?: { type?: string, is_active?: boolean, page?: number, limit?: number },
    options?: ApiRequestOptions
  ) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const endpoint = `/classifications/get${queryString ? `?${queryString}` : ""}`;
    return api.get<PaginatedClassificationsResponse>(endpoint, options);
  },

  createClassification: async (data: ClassificationCreate) => {
    return api.post<Classification>("/classifications/", data);
  },

  updateClassification: async (id: number, data: ClassificationUpdate) => {
    return api.put<Classification>(`/classifications/update/${id}`, data);
  },

  deleteClassification: async (id: number) => {
    return api.delete<void>(`/classifications/delete/${id}`);
  },
};
