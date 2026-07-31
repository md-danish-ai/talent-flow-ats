export interface Department {
  id: number;
  name: string;
  is_active: boolean;
  requires_interview: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DepartmentCreate {
  name: string;
  is_active?: boolean;
  requires_interview?: boolean;
}

export interface DepartmentUpdate {
  name?: string;
  is_active?: boolean;
  requires_interview?: boolean;
}
