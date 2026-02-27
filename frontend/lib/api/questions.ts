import { api } from "./index";

export interface QuestionOption {
  option_label: string;
  option_text: string;
  is_correct: boolean;
}

export interface QuestionAnswer {
  answer_text?: string | null;
  explanation?: string | null;
}

export interface ClassificationRef {
  id: number;
  code: string;
  type: string;
  name: string;
  metadata?: Record<string, unknown>;
  is_active: boolean;
  sort_order: number;
}

export interface Question {
  id: number;
  question_text: string;
  image_url?: string | null;
  passage?: string | null;
  marks: number;
  is_active: boolean;
  options: QuestionOption[];
  answer?: QuestionAnswer;
  question_type?: ClassificationRef | null;
  subject?: ClassificationRef | null;
  exam_level?: ClassificationRef | null;
  created_at?: string;
  updated_at?: string;
}

export interface OptionCreate {
  option_label: string;
  option_text: string;
  is_correct: boolean;
}

export interface AnswerCreate {
  answer_text?: string | null;
  explanation?: string | null;
}

export interface QuestionCreate {
  question_type: string;
  subject: string;
  exam_level: string;
  question_text: string;
  image_url?: string | null;
  passage?: string | null;
  marks: number;
  is_active?: boolean;
  options: OptionCreate[];
  answer: AnswerCreate;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  order?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total_records: number;
    total_pages: number;
    current_page: number;
    per_page: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export const questionsApi = {
  getQuestions: async (params?: PaginationParams & { question_type?: string, subject?: string, exam_level?: string, is_active?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const endpoint = `/questions/get${queryString ? `?${queryString}` : ""}`;
    return api.get<PaginatedResponse<Question>>(endpoint);
  },
  getQuestion: async (id: number) => {
    return api.get<Question>(`/questions/get/${id}`);
  },
  createQuestion: async (data: QuestionCreate) => {
    return api.post("/questions/create", data);
  },
  updateQuestion: async (id: number, data: Partial<QuestionCreate>) => {
    return api.patch(`/questions/update/${id}`, data);
  },
  toggleQuestionStatus: async (id: number) => {
    return api.patch<{ message: string; is_active: boolean }>(`/questions/toggle/${id}`);
  },
  deleteQuestion: async (id: number) => {
    // Backend exposes DELETE /questions/{question_id}
    return api.delete(`/questions/${id}`);
  },
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

    const getCookie = (name: string) => {
      if (typeof document === "undefined") return undefined;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return undefined;
    };

    let token = getCookie("auth_token");
    if (token) {
      token = token.replace(/^["%22]+|["%22]+$/g, "");
    }

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/questions/upload-image`, {
      method: "POST",
      body: formData,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to upload image");
    }

    const result = await response.json();
    return result.data as { image_url: string };
  },
};
