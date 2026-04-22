import { api, type ApiRequestOptions } from "./index";
import { ENDPOINTS } from "./endpoints";

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

export interface GradeSetting {
  min: number;
  max: number;
  grade_label: string;
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
  grade_settings?: GradeSetting[];
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
    const endpoint = `${ENDPOINTS.PAPERS.GET}${queryString ? `?${queryString}` : ""}`;
    return api.get<PaginatedPapersResponse>(endpoint, options);
  },

  getPaperById: async (id: number) => {
    return api.get<PaperSetup>(ENDPOINTS.PAPERS.GET_BY_ID(id));
  },

  createPaper: async (data: PaperSetupCreate) => {
    return api.post<PaperSetup>(ENDPOINTS.PAPERS.CREATE, data);
  },

  updatePaper: async (
    id: number,
    data: Partial<PaperSetupCreate>,
    options?: ApiRequestOptions,
  ) => {
    return api.put<PaperSetup>(ENDPOINTS.PAPERS.UPDATE(id), data, options);
  },

  deletePaper: async (id: number) => {
    return api.delete<void>(ENDPOINTS.PAPERS.DELETE(id));
  },

  togglePaperStatus: async (id: number, is_active: boolean) => {
    return api.put<PaperSetup>(ENDPOINTS.PAPERS.UPDATE(id), { is_active });
  },

  updateGradeSettings: async (id: number, grade_settings: GradeSetting[]) => {
    return api.put<PaperSetup>(
      ENDPOINTS.PAPERS.GRADE_SETTINGS(id),
      grade_settings,
    );
  },
};
