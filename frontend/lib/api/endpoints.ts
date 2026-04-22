/**
 * Centralized API endpoints for the application.
 * All backend routes are defined here as a single source of truth.
 */

export const ENDPOINTS = {
  AUTH: {
    SIGN_IN: "/auth/sign-in-user",
    SIGN_UP: "/auth/sign-up-user",
    ME: "/auth/me",
    CREATE_ADMIN: "/auth/create-admin-account",
    CREATE_PROJECT_LEAD: "/auth/create-project-lead-account",
    GET_ALL_USERS: "/auth/get-all-system-users",
    TOGGLE_STATUS: (id: string | number) => `/auth/toggle-user-active-status/${id}`,
    DELETE_USER: (id: string | number) => `/auth/remove-user-account/${id}`,
    UPDATE_BASIC_INFO: (id: string | number) => `/auth/update-user-profile/${id}`,
    USERS_BY_ROLE: (role: string) => `/auth/list-users-by-role/${role}`,
  },

  CLASSIFICATIONS: {
    GET: "/classifications/get-classifications",
    CREATE: "/classifications/create-classification",
    UPDATE: (id: string | number) => `/classifications/update-classification/${id}`,
    DELETE: (id: string | number) => `/classifications/remove-classification/${id}`,
  },

  DEPARTMENTS: {
    GET: "/departments/get-departments",
    CREATE: "/departments/create-department",
    UPDATE: (id: string | number) => `/departments/update-department/${id}`,
    DELETE: (id: string | number) => `/departments/remove-department/${id}`,
  },

  QUESTIONS: {
    GET: "/questions/get-questions",
    GET_BY_ID: (id: string | number) => `/questions/question-details/${id}`,
    CREATE: "/questions/create-question",
    UPDATE: (id: string | number) => `/questions/update-question/${id}`,
    UPDATE_STATUS: (id: string | number) => `/questions/questions-status/${id}`,
    DELETE: (id: string | number) => `/questions/remove-question/${id}`,
    GET_BY_IDS: "/questions/get-by-ids",
    AUTO_GENERATE: "/questions/auto-generate",
    TYPE_COUNTS: "/questions/type-counts",
    UPLOAD_IMAGE: "/questions/upload-image",
  },

  PAPERS: {
    GET: "/papers/get-papers",
    GET_BY_ID: (id: string | number) => `/papers/paper-details/${id}`,
    CREATE: "/papers/create-paper",
    UPDATE: (id: string | number) => `/papers/update-paper/${id}`,
    DELETE: (id: string | number) => `/papers/remove-paper/${id}`,
    GRADE_SETTINGS: (id: string | number) => `/papers/grade-settings/${id}`,
  },

  PAPER_ASSIGNMENTS: {
    GET: "/paper-assignments/get-all-assignments",
    ASSIGN: "/paper-assignments/assign-new-paper",
    AUTO_RULES: "/paper-assignments/get-auto-rules",
    AUTO_RULE_BY_ID: (id: string | number) => `/paper-assignments/get-auto-rule-details/${id}`,
    MY_INTERVIEW_PAPER: "/paper-assignments/get-my-assigned-paper",
  },

  NOTIFICATIONS: {
    GET: "/notifications/get-all-notifications",
    READ: "/notifications/mark-read",
    UNREAD: "/notifications/mark-unread",
  },

  RESULTS: {
    GET_ALL: "/admin/results/get-all-results",
    USER_DETAIL: (userId: string | number) => `/admin/results/user-result-details/${userId}`,
    USER_ATTEMPTS: (userId: string | number) => `/admin/results/user-attempt-history/${userId}`,
    RESET_ATTEMPT: (userId: string | number) => `/admin/results/reset-today-attempt/${userId}`,
    RESET_DETAILS: (userId: string | number) => `/admin/results/clear-user-details/${userId}`,
    RE_INTERVIEW: (userId: string | number) => `/admin/results/enable-reinterview/${userId}`,
    RESET_SUBJECTS: (userId: string | number) => `/admin/results/reset-user-subjects/${userId}`,
    MANUAL_MARKS: (userId: string | number, attemptId: string | number, questionId: string | number) =>
      `/admin/results/manual-marks/${userId}/${attemptId}/${questionId}`,
    ATTEMPT_DETAIL: (attemptId: string | number) => `/results/get-attempt-detail/${attemptId}`,
  },

  USER_DETAILS: {
    ADD: "/user-details/save-user-details",
    UPDATE: "/user-details/edit-user-details",
    GET_BY_ID: (id: string | number) => `/user-details/get-user-details/${id}`,
  },

  INTERVIEW_ATTEMPTS: {
    ACTIVE_STATUS: "/user/interview-attempts/check-active-status",
    START: "/user/interview-attempts/start-new-attempt",
    SUBMIT: (id: string | number) => `/user/interview-attempts/submit-attempt/${id}`,
    AUTO_SUBMIT: (id: string | number) => `/user/interview-attempts/auto-submit-attempt/${id}`,
    SUMMARY: (id: string | number) => `/user/interview-attempts/get-attempt-summary/${id}`,
    SAVE_ANSWER: (attemptId: string | number, questionId: string | number) =>
      `/user/interview-attempts/save-answer/${attemptId}/${questionId}`,
    SAVE_BATCH: (attemptId: string | number) => `/user/interview-attempts/save-answers-batch/${attemptId}`,
    SKIP_SECTION: (attemptId: string | number, sectionName: string) =>
      `/user/interview-attempts/skip-section/${attemptId}/${sectionName}`,
  },

  DASHBOARD: {
    OVERVIEW: "/admin/dashboard/overview",
  },
} as const;
