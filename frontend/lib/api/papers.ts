// import { Classification } from "./classifications";

export interface PaperSubjectConfig {
  id?: number;
  subject_id: number;
  subject_name: string;
  is_selected: boolean;
  question_count: number;
  total_marks: number;
  order: number;
}

export interface PaperSetup {
  id: number;
  department_id: number;
  department_name?: string;
  test_level_id: number;
  test_level_name?: string;
  paper_name: string;
  description: string;
  english_test_time: string;
  excel_time: string;
  company_details_time: string;
  lead_generation_time: string;
  typing_test_time: string;
  rpit_test_time: string;
  total_time: string;
  total_marks?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  subject_configs: PaperSubjectConfig[];
}

export interface PaperSetupCreate {
  department_id: number;
  test_level_id: number;
  paper_name: string;
  description: string;
  english_test_time: string;
  excel_time: string;
  company_details_time: string;
  lead_generation_time: string;
  typing_test_time: string;
  rpit_test_time: string;
  subject_configs: Omit<PaperSubjectConfig, "subject_name">[];
}

export const papersApi = {
  getPapers: async () => {
    // Mocking the API response
    return {
      data: [
        {
          id: 1,
          paper_name: "Research Analyst - Test Paper",
          test_level_name: "Fresher",
          description: "Edited on October 02, 2019",
          total_time: "02:15:00",
          total_marks: 350,
          is_active: true,
          created_at: "2019-10-02T10:00:00Z",
        },
        {
          id: 2,
          paper_name: "Quality Analyst - Test Paper",
          test_level_name: "Quality Analyst",
          description: "October 2020",
          total_time: "02:00:00",
          total_marks: 360,
          is_active: true,
          created_at: "2020-10-01T10:00:00Z",
        },
        {
          id: 3,
          paper_name: "Team Lead - Test Paper",
          test_level_name: "Team Lead",
          description: "Edited on October 02, 2019",
          total_time: "02:00:00",
          total_marks: 350,
          is_active: true,
          created_at: "2019-10-02T10:00:00Z",
        },
      ] as Partial<PaperSetup>[],
      pagination: {
        total_records: 3,
      },
    };
  },

  getPaperById: async (id: number) => {
    // Mocking
    return {
      id,
      paper_name: "Temp",
      department_name: "KPO",
      test_level_name: "Team Lead",
      description: "Temp",
      total_time: "01:50:00",
      total_marks: 350,
      subject_configs: [
        {
          subject_name: "Comprehension",
          question_count: 5,
          total_marks: 10,
          order: 1,
        },
        {
          subject_name: "Written",
          question_count: 10,
          total_marks: 20,
          order: 2,
        },
        {
          subject_name: "Grammar",
          question_count: 7,
          total_marks: 7,
          order: 3,
        },
      ],
    };
  },

  createPaper: async (data: PaperSetupCreate) => {
    return { id: Math.floor(Math.random() * 1000), ...data };
  },

  updatePaper: async (id: number, data: Partial<PaperSetupCreate>) => {
    return { id, ...data };
  },

  deletePaper: async (_: number) => {
    return { success: true };
  },

  togglePaperStatus: async (_: number) => {
    return { success: true };
  },
};
