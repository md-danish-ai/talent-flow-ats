import { api, type ApiRequestOptions } from "./base";
import { ENDPOINTS } from "./endpoints";
import {
  Department,
  DepartmentCreate,
  DepartmentUpdate,
  PaginatedResponse,
} from "@types";

export const departmentsApi = {
  getDepartments: async (
    params?: {
      is_active?: boolean;
      page?: number;
      limit?: number;
      search?: string;
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
    const endpoint = `${ENDPOINTS.DEPARTMENTS.GET}${queryString ? `?${queryString}` : ""}`;
    return api.get<PaginatedResponse<Department>>(endpoint, options);
  },

  createDepartment: async (data: DepartmentCreate) => {
    return api.post<Department>(ENDPOINTS.DEPARTMENTS.CREATE, data);
  },

  updateDepartment: async (id: number, data: DepartmentUpdate) => {
    return api.put<Department>(ENDPOINTS.DEPARTMENTS.UPDATE(id), data);
  },

  deleteDepartment: async (id: number) => {
    return api.delete<void>(ENDPOINTS.DEPARTMENTS.DELETE(id));
  },
};
