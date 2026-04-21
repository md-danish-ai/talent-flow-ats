import { api } from "./index";
import { ENDPOINTS } from "./endpoints";
import type { ApiRequestOptions } from "./client";
import type {
  SignInFormValues,
  SignUpFormValues,
  CreateAdminFormValues,
} from "@lib/validations/auth";
import type { UserDetails } from "./user-details";
import type { CurrentUser } from "@lib/auth/user-utils";

export interface AuthResponse {
  access_token: string;
  user: {
    id: number | string;
    username: string;
    email?: string;
    mobile?: string;
    role: string;
    department_id?: number | null;
  };
}

export interface SignUpResponse {
  message: string;
  access_token: string;
  user: {
    id: number | string;
    username: string;
    email?: string;
    mobile?: string;
    role: string;
    department_id?: number | null;
  };
}

export interface CreateAdminResponse {
  message: string;
  access_token: string;
  user: {
    id: number | string;
    username: string;
    role: string;
  };
}

// POST /auth/signup - Register a new user account
export async function signUp(
  data: SignUpFormValues,
  options?: Pick<ApiRequestOptions, "cookies">,
): Promise<SignUpResponse> {
  return api.post<SignUpResponse>(ENDPOINTS.AUTH.SIGN_UP, data, options);
}

// POST /auth/signin - Authenticate a user and receive a token
export async function signIn(
  data: SignInFormValues,
  options?: Pick<ApiRequestOptions, "cookies">,
): Promise<AuthResponse> {
  return api.post<AuthResponse>(ENDPOINTS.AUTH.SIGN_IN, data, options);
}

// GET /auth/me - Fetch the current authenticated user's profile and recruitment details
export async function getMyDetails(): Promise<UserDetails> {
  const user = await api.get<CurrentUser>(ENDPOINTS.AUTH.ME);
  if (!user?.recruitment_details) {
    return { is_submitted: false } as UserDetails;
  }
  return user.recruitment_details as unknown as UserDetails;
}

// POST /auth/create-admin - Create a new admin user
export async function createAdmin(
  data: CreateAdminFormValues,
  options?: Pick<ApiRequestOptions, "cookies">,
): Promise<CreateAdminResponse> {
  return api.post<CreateAdminResponse>(ENDPOINTS.AUTH.CREATE_ADMIN, data, options);
}

// POST /auth/create-project-lead - Create a new project lead
export async function createProjectLead(
  data: CreateAdminFormValues,
  options?: Pick<ApiRequestOptions, "cookies">,
): Promise<CreateAdminResponse> {
  return api.post<CreateAdminResponse>(
    ENDPOINTS.AUTH.CREATE_PROJECT_LEAD,
    data,
    options,
  );
}

export interface UserListResponse {
  id: number;
  username: string;
  mobile: string;
  email: string | null;
  role: string;
  department_id?: number | null;
  department_name?: string | null;
  test_level_id?: number | null;
  test_level_name?: string | null;
  is_active: boolean;
  is_reinterview?: boolean;
  reinterview_date?: string | null;
  user_type?: "new" | "returning";
  assignment?: {
    is_assigned: boolean;
    paper_id: number | null;
    paper_name?: string | null;
    department_id: number | null;
    department_name?: string | null;
    test_level_id: number | null;
    test_level_name?: string | null;
    is_attempted: boolean;
    has_started: boolean;
  } | null;
  is_details_submitted: boolean;
  is_interview_submitted: boolean;
}

// GET /auth/get-all-users?role={role}&date={date}&date_from={date_from}&date_to={date_to}
export async function getUsersByRole(
  role: string,
  options?: Pick<ApiRequestOptions, "cookies"> & {
    date?: string;
    date_from?: string;
    date_to?: string;
  },
): Promise<UserListResponse[]> {
  const queryParams = new URLSearchParams({ role });
  if (options?.date) queryParams.append("date", options.date);
  if (options?.date_from) queryParams.append("date_from", options.date_from);
  if (options?.date_to) queryParams.append("date_to", options.date_to);

  const apiOptions = options ? { ...options } : undefined;
  if (apiOptions) {
    delete (apiOptions as { date?: string }).date;
    delete (apiOptions as { date_from?: string }).date_from;
    delete (apiOptions as { date_to?: string }).date_to;
  }

  return api.get<UserListResponse[]>(
    `${ENDPOINTS.AUTH.GET_ALL_USERS}?${queryParams.toString()}`,
    apiOptions,
  );
}

// PUT /auth/toggle-status/{user_id} - Toggle user's active status
export async function toggleUserStatus(
  userId: number,
  options?: Pick<ApiRequestOptions, "cookies">,
): Promise<{ id: number; is_active: boolean }> {
  return api.put<{ id: number; is_active: boolean }>(
    ENDPOINTS.AUTH.TOGGLE_STATUS(userId),
    {},
    options,
  );
}

// DELETE /auth/delete/{user_id} - Delete a user
export async function deleteUser(
  userId: number,
  options?: Pick<ApiRequestOptions, "cookies">,
): Promise<{ id: number; message: string }> {
  return api.delete<{ id: number; message: string }>(
    ENDPOINTS.AUTH.DELETE_USER(userId),
    options,
  );
}

// PUT /auth/update-basic-info/{user_id} - Update basic user info
export async function updateBasicInfo(
  userId: number | string,
  data: SignUpFormValues,
  options?: Pick<ApiRequestOptions, "cookies">,
): Promise<{ message: string; user_id: number }> {
  return api.put<{ message: string; user_id: number }>(
    ENDPOINTS.AUTH.UPDATE_BASIC_INFO(userId),
    data,
    options,
  );
}
