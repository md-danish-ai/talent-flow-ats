import { filterRegistry } from "./registry";

/**
 * Initialize all admin filters here to keep the registry centralized.
 */

// 1. Today's Papers / Users Listing
filterRegistry.register("today-users", [
  {
    id: "date",
    label: "Select Date Range",
    type: "date-range",
  },
  {
    id: "search",
    label: "Search Candidates",
    type: "search",
    placeholder: "Search by name, mobile...",
  },
  {
    id: "status",
    label: "Attempt Status",
    type: "select",
    placeholder: "Select Status",
    options: [
      { id: "all", label: "All Status" },
      { id: "pending", label: "Pending Assignment" },
      { id: "ready", label: "Ready" },
      { id: "inprogress", label: "In Progress" },
      { id: "submitted", label: "Submitted" },
      { id: "expired", label: "Expired" },
    ],
  },
  {
    id: "department",
    label: "Department",
    type: "select",
    placeholder: "All Departments",
    options: [{ id: "all", label: "All Departments" }],
  },
  {
    id: "level",
    label: "Exam Level",
    type: "select",
    placeholder: "Select Level",
    options: [{ id: "all", label: "All Levels" }],
  },
]);

// 2. MCQ Question Bank
filterRegistry.register("mcq-filters", [
  {
    id: "search",
    label: "Search Questions",
    type: "search",
    placeholder: "Search by question content...",
  },
  {
    id: "subject",
    label: "Subject",
    type: "select",
    placeholder: "Filter by Subject",
    options: [{ id: "all", label: "All Subjects" }],
  },
  {
    id: "examLevel",
    label: "Exam Level",
    type: "select",
    placeholder: "Filter by Level",
    options: [{ id: "all", label: "All Levels" }],
  },
  {
    id: "marks",
    label: "Marks",
    type: "select",
    placeholder: "Filter by Marks",
    options: [
      { id: "all", label: "All Marks" },
      { id: "1", label: "1 Mark" },
      { id: "2", label: "2 Marks" },
      { id: "3", label: "3 Marks" },
      { id: "4", label: "4 Marks" },
      { id: "5", label: "5 Marks" },
    ],
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    placeholder: "Filter by Status",
    options: [
      { id: "all", label: "All Status" },
      { id: "true", label: "Active" },
      { id: "false", label: "Inactive" },
    ],
  },
]);

// 3. Reset Status Listing
filterRegistry.register("reset-status-filters", [
  {
    id: "search",
    label: "Search Candidates",
    type: "search",
    placeholder: "Search by name or mobile...",
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    placeholder: "All Status",
    options: [
      { id: "all", label: "All Status" },
      { id: "pending", label: "Pending Assignment" },
      { id: "ready", label: "Ready" },
      { id: "inprogress", label: "In Progress" },
      { id: "submitted", label: "Submitted" },
      { id: "expired", label: "Expired" },
    ],
  },
  {
    id: "department",
    label: "Department",
    type: "select",
    placeholder: "All Departments",
    options: [{ id: "all", label: "All Departments" }],
  },
  {
    id: "level",
    label: "Exam Level",
    type: "select",
    placeholder: "All Levels",
    options: [{ id: "all", label: "All Levels" }],
  },
]);

// 4. Assessment Results
filterRegistry.register("results-filters", [
  {
    id: "date",
    label: "Date Range",
    type: "date-range",
  },
  {
    id: "search",
    label: "Search Candidates",
    type: "search",
    placeholder: "Search by name, mobile...",
  },
  {
    id: "status",
    label: "Attempt Status",
    type: "select",
    options: [
      { id: "all", label: "All Statuses" },
      { id: "started", label: "Started" },
      { id: "submitted", label: "Submitted (Manual)" },
      { id: "auto_submitted", label: "Auto Submitted" },
    ],
  },
  {
    id: "completionReason",
    label: "Completion Reason",
    type: "select",
    options: [
      { id: "all", label: "All Reasons" },
      { id: "manual", label: "Manual" },
      { id: "time_over", label: "Time Over" },
    ],
  },
  {
    id: "overallGrade",
    label: "Overall Grade",
    type: "select",
    options: [
      { id: "all", label: "All Grades" },
      { id: "Excellent", label: "Excellent" },
      { id: "Good", label: "Good" },
      { id: "Average", label: "Average" },
      { id: "Poor", label: "Poor" },
    ],
  },
]);

// 5. Admin Management
filterRegistry.register("admin-filters", [
  {
    id: "search",
    label: "Search Admins",
    type: "search",
    placeholder: "Search by name, email or mobile...",
  },
]);

// 6. Management -> Users
filterRegistry.register("management-user-filters", [
  {
    id: "search",
    label: "Quick Search",
    type: "search",
    placeholder: "Name, Mobile or Email...",
  },
  {
    id: "department_id",
    label: "Department",
    type: "select",
    placeholder: "All Departments",
    options: [{ id: "all", label: "All Departments" }],
  },
  {
    id: "test_level_id",
    label: "Exam Level",
    type: "select",
    placeholder: "All Levels",
    options: [{ id: "all", label: "All Levels" }],
  },
]);

// 7. Management -> Project Leads
filterRegistry.register("project-lead-filters", [
  {
    id: "search",
    label: "Search Project Leads",
    type: "search",
    placeholder: "Search by name, email or mobile...",
  },
]);

// 8. Management -> Departments
filterRegistry.register("department-filters", [
  {
    id: "search",
    label: "Search Departments",
    type: "search",
    placeholder: "Search by name...",
  },
]);

// 9. Management -> Subjects & Levels
filterRegistry.register("type-management-filters", [
  {
    id: "type",
    label: "Classification Type",
    type: "tabs",
    options: [
      { id: "subjects", label: "Subjects" },
      { id: "levels", label: "Exam Levels" },
    ],
    props: { variant: "pills", size: "sm" },
  },
  {
    id: "search",
    label: "Search",
    type: "search",
    placeholder: "Search by name...",
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { id: "all", label: "All Status" },
      { id: "active", label: "Active" },
      { id: "inactive", label: "Inactive" },
    ],
  },
]);

// 10. Universal Question Bank (all types)
filterRegistry.register("question-bank-filters", [
  {
    id: "search",
    label: "Search Questions",
    type: "search",
    placeholder: "Search by question content...",
  },
  {
    id: "subject",
    label: "Subject",
    type: "select",
    placeholder: "Filter by Subject",
    options: [{ id: "all", label: "All Subjects" }],
  },
  {
    id: "examLevel",
    label: "Exam Level",
    type: "select",
    placeholder: "Filter by Level",
    options: [{ id: "all", label: "All Levels" }],
  },
  {
    id: "marks",
    label: "Marks",
    type: "select",
    placeholder: "Filter by Marks",
    options: [
      { id: "all", label: "All Marks" },
      { id: "1", label: "1 Mark" },
      { id: "2", label: "2 Marks" },
      { id: "3", label: "3 Marks" },
      { id: "4", label: "4 Marks" },
      { id: "5", label: "5 Marks" },
      { id: "6", label: "6 Marks" },
      { id: "7", label: "7 Marks" },
      { id: "8", label: "8 Marks" },
      { id: "9", label: "9 Marks" },
      { id: "10", label: "10 Marks" },
    ],
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    placeholder: "Filter by Status",
    options: [
      { id: "all", label: "All Status" },
      { id: "true", label: "Active" },
      { id: "false", label: "Inactive" },
    ],
  },
]);

// 11. Paper Setup Listing
filterRegistry.register("paper-setup-filters", [
  {
    id: "search",
    label: "Search Papers",
    type: "search",
    placeholder: "Paper name...",
  },
  {
    id: "department_id",
    label: "Department",
    type: "select",
    placeholder: "All Departments",
    options: [{ id: "all", label: "All Departments" }],
  },
  {
    id: "test_level_id",
    label: "Exam Level",
    type: "select",
    placeholder: "All Levels",
    options: [{ id: "all", label: "All Levels" }],
  },
]);
