export interface PaperSubjectConfig {
  id?: number;
  subject_id: number;
  subject_name?: string;
  is_selected: boolean;
  question_count: number;
  total_marks: number;
  time_minutes: number;
  order: number;
}

export interface GradeSetting {
  min: number;
  max: number;
  grade_label: string;
}

export interface Paper {
  id: number;
  department_id: number;
  test_level_id: string;
  paper_name: string;
  description: string;
  total_time: string;
  total_marks: number;
  is_active: boolean;
  grade?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  department_name?: string;
  test_level_name?: string;
  subject_ids_data: PaperSubjectConfig[];
  question_id?: number[];
  grade_settings?: GradeSetting[];
}

export interface PaperCreate {
  department_id: number;
  test_level_id: string;
  paper_name: string;
  description: string;
  total_time: string;
  total_marks: number;
  subject_ids_data: PaperSubjectConfig[];
  question_id?: number[];
}

export type PaperSetup = Paper;
export type PaperSetupCreate = PaperCreate;
