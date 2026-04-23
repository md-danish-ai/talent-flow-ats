export type UserRole = "admin" | "user" | "project-lead" | string;

export interface User {
  id: number;
  username: string;
  email?: string | null;
  mobile?: string;
  role: UserRole;
  department_id?: number | null;
  department_name?: string | null;
  test_level_id?: number | null;
  test_level_name?: string | null;
  is_active: boolean;
}

export interface UserAssignment {
  is_assigned: boolean;
  paper_id: number | null;
  paper_name?: string | null;
  department_id: number | null;
  department_name?: string | null;
  test_level_id: number | null;
  test_level_name?: string | null;
  is_attempted: boolean;
  has_started: boolean;
}

export interface UserListResponse extends User {
  is_reinterview?: boolean;
  reinterview_date?: string | null;
  user_type?: "new" | "returning";
  assignment?: UserAssignment | null;
  is_details_submitted: boolean;
  is_interview_submitted: boolean;
}
