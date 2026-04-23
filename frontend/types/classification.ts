export interface Classification {
  id: number;
  code: string;
  type: string;
  name: string;
  metadata?: Record<string, unknown>;
  sort_order?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ClassificationCreate {
  type: string;
  name: string;
  code?: string;
  metadata?: Record<string, unknown>;
  sort_order?: number;
  is_active?: boolean;
}

export interface ClassificationUpdate {
  name?: string;
  metadata?: Record<string, unknown>;
  sort_order?: number;
  is_active?: boolean;
  type?: string;
  code?: string;
}
