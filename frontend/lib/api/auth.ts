import { api } from "./index";
import type { ApiRequestOptions } from "./client";
import type { SignInFormValues, SignUpFormValues } from "@lib/validations/auth";
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
  };
}

// POST /auth/signup - Register a new user account
export async function signUp(
  data: SignUpFormValues,
  options?: Pick<ApiRequestOptions, "cookies">,
): Promise<SignUpResponse> {
  return api.post<SignUpResponse>("/auth/signup", data, options);
}

// POST /auth/signin - Authenticate a user and receive a token
export async function signIn(
  data: SignInFormValues,
  options?: Pick<ApiRequestOptions, "cookies">,
): Promise<AuthResponse> {
  return api.post<AuthResponse>("/auth/signin", data, options);
}

// GET /auth/me - Fetch the current authenticated user's profile and recruitment details
export async function getMyDetails(): Promise<UserDetails> {
  const user = await api.get<CurrentUser>("/auth/me");
  if (!user?.recruitment_details) {
    return { is_submitted: false } as UserDetails;
  }
  return user.recruitment_details as unknown as UserDetails;
}
