import { api, type ApiRequestOptions } from "./index";
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
    return api.post<Classification>(ENDPOINTS.CLASSIFICATIONS.CREATE, data);
  },

  updateClassification: async (id: number, data: ClassificationUpdate) => {
    return api.put<Classification>(ENDPOINTS.CLASSIFICATIONS.UPDATE(id), data);
  },

  deleteClassification: async (id: number) => {
    return api.delete<void>(ENDPOINTS.CLASSIFICATIONS.DELETE(id));
  },
};
