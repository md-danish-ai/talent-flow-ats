import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  locationsApi,
  State,
  District,
  DistrictCreate,
  DistrictUpdate,
} from "@lib/api/locations";
import { toast } from "@lib/toast";

export const useStates = () => {
  return useQuery<State[], Error>({
    queryKey: ["locations", "states"],
    queryFn: () => locationsApi.getStates(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

export const useDistrictsByState = (stateId: number | null) => {
  return useQuery<District[], Error>({
    queryKey: ["locations", "states", stateId, "districts"],
    queryFn: () => {
      if (!stateId) return Promise.resolve([]);
      return locationsApi.getDistrictsByState(stateId);
    },
    enabled: !!stateId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

export const useCreateDistrict = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      stateId,
      data,
    }: {
      stateId: number;
      data: DistrictCreate;
    }) => locationsApi.createDistrict(stateId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["locations", "states", variables.stateId, "districts"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create district");
    },
  });
};

export const useUpdateDistrict = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      districtId,
      data,
    }: {
      districtId: number;
      data: DistrictUpdate;
    }) => locationsApi.updateDistrict(districtId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["locations", "states"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update district");
    },
  });
};
