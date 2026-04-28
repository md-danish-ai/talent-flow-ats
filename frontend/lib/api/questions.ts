import { api } from "./base";
import { BASE_URL } from "./client";
import { ENDPOINTS } from "./endpoints";
import {
  Question,
  QuestionCreate,
  AutoGenerateRequest,
  AutoGenerateResponse,
  PaginatedResponse,
  PaginationParams,
} from "@types";

export const questionsApi = {
  getQuestions: async (
    params?: PaginationParams & {
      question_type?: string;
      subject?: string;
      exam_level?: string;
      is_active?: boolean;
      marks?: number;
    },
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
    const endpoint = `${ENDPOINTS.QUESTIONS.GET}${queryString ? `?${queryString}` : ""}`;
    return api.get<PaginatedResponse<Question>>(endpoint);
  },
  getQuestion: async (id: number) => {
    return api.get<Question>(ENDPOINTS.QUESTIONS.GET_BY_ID(id));
  },
  getQuestionsByIds: async (ids: number[]) => {
    return api.post<Question[]>(
      ENDPOINTS.QUESTIONS.GET_BY_IDS,
      { ids },
      { silentSuccess: true },
    );
  },
  autoGenerateQuestions: async (data: AutoGenerateRequest) => {
    return api.post<AutoGenerateResponse>(
      ENDPOINTS.QUESTIONS.AUTO_GENERATE,
      data,
      {
        silentSuccess: true,
      },
    );
  },
  getQuestionTypeCounts: async (subject: string, examLevel: string) => {
    return api.get<{ type_code: string; marks: number; count: number }[]>(
      `${ENDPOINTS.QUESTIONS.TYPE_COUNTS}?subject=${subject}&exam_level=${examLevel}`,
    );
  },
  createQuestion: async (data: QuestionCreate) => {
    return api.post(ENDPOINTS.QUESTIONS.CREATE, data);
  },
  updateQuestion: async (id: number, data: Partial<QuestionCreate>) => {
    return api.put(ENDPOINTS.QUESTIONS.UPDATE(id), data);
  },
  toggleQuestionStatus: async (id: number) => {
    return api.put<{ message: string; is_active: boolean }>(
      ENDPOINTS.QUESTIONS.UPDATE_STATUS(id),
      undefined,
      { silentSuccess: true },
    );
  },
  deleteQuestion: async (id: number) => {
    // Backend exposes DELETE /questions/{question_id}
    return api.delete(ENDPOINTS.QUESTIONS.DELETE(id));
  },
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);


    const getCookie = (name: string) => {
      if (typeof document === "undefined") return undefined;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return undefined;
    };

    let token = getCookie("auth_token");
    if (token) {
      // Fix: properly strip only quote characters
      token = token.replace(/^"|"$/g, "").replace(/^%22|%22$/g, "");
      try {
        token = decodeURIComponent(token);
      } catch {
        /* keep raw */
      }
    }

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${BASE_URL}${ENDPOINTS.QUESTIONS.UPLOAD_IMAGE}`,
      {
        method: "POST",
        body: formData,
        headers,
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to upload image");
    }

    const result = await response.json();
    return result.data as { image_url: string };
  },
};
