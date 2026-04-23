import { User } from "./user";

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface SignUpResponse {
  message: string;
  access_token: string;
  user: User;
}

export interface CreateAdminResponse {
  message: string;
  access_token: string;
  user: Pick<User, "id" | "username" | "role">;
}
