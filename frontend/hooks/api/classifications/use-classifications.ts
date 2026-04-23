import { useQuery } from "@tanstack/react-query";
import { classificationsApi } from "@lib/api/classifications";

export function useClassifications(params?: {
  type?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["classifications", params],
    queryFn: () => classificationsApi.getClassifications(params),
  });
}
