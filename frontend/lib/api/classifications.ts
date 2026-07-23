import { api, type ApiRequestOptions } from "./base";
import { ENDPOINTS } from "./endpoints";
import {
  Classification,
  ClassificationCreate,
  ClassificationUpdate,
  PaginatedResponse,
} from "@types";

export const classificationsApi = {
  getClassifications: async (
    params?: {
      type?: string;
      is_active?: boolean;
      page?: number;
      limit?: number;
      sort_by?: string;
      order?: string;
    },
    options?: ApiRequestOptions,
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
    const endpoint = `${ENDPOINTS.CLASSIFICATIONS.GET}${queryString ? `?${queryString}` : ""}`;
    return api.get<PaginatedResponse<Classification>>(endpoint, options);
  },

  createClassification: async (data: ClassificationCreate) => {
    return api.post<Classification>(ENDPOINTS.CLASSIFICATIONS.CREATE, data, {
      silentSuccess: true,
    });
  },

  updateClassification: async (id: number, data: ClassificationUpdate) => {
    return api.put<Classification>(ENDPOINTS.CLASSIFICATIONS.UPDATE(id), data, {
      silentSuccess: true,
    });
  },

  reorderClassifications: async (
    items: { id: number; sort_order: number }[],
  ) => {
    return api.put<{ message: string }>(
      ENDPOINTS.CLASSIFICATIONS.REORDER,
      { items },
      { silentSuccess: true },
    );
  },
};
