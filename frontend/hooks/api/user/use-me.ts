import { useQuery } from "@tanstack/react-query";
import { api } from "@lib/api/base";
import { ENDPOINTS } from "@lib/api/endpoints";
import { CurrentUser } from "@lib/auth/user-utils";

export function useMe() {
  return useQuery<CurrentUser>({
    queryKey: ["auth", "me"],
    queryFn: () => api.get<CurrentUser>(ENDPOINTS.AUTH.ME),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}
