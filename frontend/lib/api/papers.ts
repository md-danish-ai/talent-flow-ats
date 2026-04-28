import { api, type ApiRequestOptions } from "./base";
import { ENDPOINTS } from "./endpoints";
import { Paper, PaperCreate, PaginatedResponse, GradeSetting } from "@types";

export const papersApi = {
  getPapers: async (
    params?: {
      page?: number;
      limit?: number;
      search?: string;
      is_active?: boolean;
      department_id?: string | number;
      test_level_id?: string;
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
    const endpoint = `${ENDPOINTS.PAPERS.GET}${queryString ? `?${queryString}` : ""}`;
    return api.get<PaginatedResponse<Paper>>(endpoint, options);
  },

  getPaperById: async (id: number) => {
    return api.get<Paper>(ENDPOINTS.PAPERS.GET_BY_ID(id));
  },

  createPaper: async (data: PaperCreate) => {
    return api.post<Paper>(ENDPOINTS.PAPERS.CREATE, data);
  },

  updatePaper: async (
    id: number,
    data: Partial<PaperCreate>,
    options?: ApiRequestOptions,
  ) => {
    return api.put<Paper>(ENDPOINTS.PAPERS.UPDATE(id), data, options);
  },

  deletePaper: async (id: number) => {
    return api.delete<void>(ENDPOINTS.PAPERS.DELETE(id));
  },

  togglePaperStatus: async (id: number, is_active: boolean) => {
    return api.put<Paper>(ENDPOINTS.PAPERS.UPDATE(id), { is_active });
  },

  updateGradeSettings: async (id: number, grade_settings: GradeSetting[]) => {
    return api.put<Paper>(ENDPOINTS.PAPERS.GRADE_SETTINGS(id), grade_settings);
  },
};
