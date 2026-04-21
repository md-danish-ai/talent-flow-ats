import { api, type ApiRequestOptions } from "./index";
import { ENDPOINTS } from "./endpoints";

export interface Department {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedDepartmentsResponse {
  data: Department[];
  pagination: {
    total_records: number;
    total_pages: number;
    current_page: number;
    per_page: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export interface DepartmentCreate {
  name: string;
  is_active?: boolean;
}

export interface DepartmentUpdate {
  name?: string;
  is_active?: boolean;
}

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
    return api.get<PaginatedDepartmentsResponse>(endpoint, options);
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
