import { getUsersByRole } from "./auth";

export const managementApi = {
  getProjectLeads: async (options?: { limit?: number; page?: number }) => {
    return getUsersByRole("project_lead", options);
  },

  getAdmins: async (options?: { limit?: number; page?: number }) => {
    return getUsersByRole("admin", options);
  },
};
