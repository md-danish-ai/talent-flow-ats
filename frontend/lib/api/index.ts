/**
 * API barrel export — re-exports all API services.
 */
export { apiClient, ApiError } from "./client";
export type { ApiMethod, ApiRequestOptions } from "./client";

export { signUp, signIn } from "./auth";
export type { AuthResponse, SignUpResponse } from "./auth";

export { createUser, getUserByEmail } from "./users";
export type { User, CreateUserPayload } from "./users";
