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

  createPaper: async (data: PaperCreate, options?: ApiRequestOptions) => {
    return api.post<Paper>(ENDPOINTS.PAPERS.CREATE, data, {
      silentSuccess: true,
      ...options,
    });
  },

  updatePaper: async (
    id: number,
    data: Partial<PaperCreate>,
    options?: ApiRequestOptions,
  ) => {
    return api.put<Paper>(ENDPOINTS.PAPERS.UPDATE(id), data, {
      silentSuccess: true,
      ...options,
    });
  },

  togglePaperStatus: async (
    id: number,
    is_active: boolean,
    options?: ApiRequestOptions,
  ) => {
    return api.put<Paper>(
      ENDPOINTS.PAPERS.UPDATE(id),
      { is_active },
      { silentSuccess: true, ...options },
    );
  },

  updateGradeSettings: async (
    id: number,
    grade_settings: GradeSetting[],
    options?: ApiRequestOptions,
  ) => {
    return api.put<Paper>(ENDPOINTS.PAPERS.GRADE_SETTINGS(id), grade_settings, {
      silentSuccess: true,
      ...options,
    });
  },

  downloadPaperPdf: async (
    paperId: number,
    paperName?: string,
    showAnswers: boolean = true,
  ): Promise<void> => {
    const authRow = document.cookie
      .split(";")
      .find((r) => r.trim().startsWith("auth_token="));
    let token = authRow ? authRow.trim().substring("auth_token=".length) : "";
    token = token.replace(/^"|"$/g, "").replace(/^%22|%22$/g, "");
    try {
      token = decodeURIComponent(token);
    } catch {
      /* keep raw */
    }

    const { BASE_URL } = await import("./client");
    const res = await fetch(
      `${BASE_URL}${ENDPOINTS.PAPERS.PDF(paperId, showAnswers)}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) throw new Error("Paper PDF generation failed");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const contentDisposition = res.headers.get("content-disposition");
    let filename = "";
    if (contentDisposition) {
      const match = contentDisposition.match(/filename=["']?([^"';]+)["']?/i);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    if (!filename) {
      const safeName = paperName
        ? paperName.replace(/[^a-zA-Z0-9_-]/g, "_")
        : `Paper_${paperId}`;
      filename = `${safeName}_${showAnswers ? "With_Answers" : "Question_Paper"}.pdf`;
    }

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};
