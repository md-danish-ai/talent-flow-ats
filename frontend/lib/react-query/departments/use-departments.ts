import { useQuery } from "@tanstack/react-query";
import { departmentsApi, type Department } from "@lib/api/departments";

export function useDepartments(params?: {
  is_active?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}) {
  return useQuery<Department[], Error>({
    queryKey: ["departments", params],
    queryFn: async () => {
      const response = await departmentsApi.getDepartments(params);
      // Pagination response has a 'data' field which is the array of departments
      return response.data;
    },
  });
}
