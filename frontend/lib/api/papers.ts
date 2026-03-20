import { api, type ApiRequestOptions } from "./index";

export interface PaperSubjectConfig {
  id?: number;
  subject_id: number;
  subject_name?: string;
  is_selected: boolean;
  question_count: number;
  total_marks: number;
  time_minutes: number;
  order: number;
}

export interface PaperSetup {
  id: number;
  department_id: number;
  test_level_id: string;
  paper_name: string;
  description: string;
  total_time: string;
  total_marks: number;
  is_active: boolean;
  grade?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  department_name?: string;
  test_level_name?: string;
  subject_ids_data: PaperSubjectConfig[];
  question_id?: number[];
}

export interface PaperSetupCreate {
  department_id: number;
  test_level_id: string;
  paper_name: string;
  description: string;
  total_time: string;
  total_marks: number;
  subject_ids_data: PaperSubjectConfig[];
  question_id?: number[];
}

export interface PaginatedPapersResponse {
  data: PaperSetup[];
  pagination: {
    total_records: number;
    total_pages: number;
    current_page: number;
    per_page: number;
  };
}

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
    const endpoint = `/papers/get${queryString ? `?${queryString}` : ""}`;
    return api.get<PaginatedPapersResponse>(endpoint, options);
  },

  getPaperById: async (id: number) => {
    return api.get<PaperSetup>(`/papers/get/${id}`);
  },

  createPaper: async (data: PaperSetupCreate) => {
    return api.post<PaperSetup>("/papers/create", data);
  },

  updatePaper: async (
    id: number,
    data: Partial<PaperSetupCreate>,
    options?: ApiRequestOptions,
  ) => {
    return api.put<PaperSetup>(`/papers/update/${id}`, data, options);
  },

  deletePaper: async (id: number) => {
    return api.delete<void>(`/papers/delete/${id}`);
  },

  togglePaperStatus: async (id: number, is_active: boolean) => {
    return api.put<PaperSetup>(`/papers/update/${id}`, { is_active });
  },
};
