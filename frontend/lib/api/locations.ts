import { api } from "@lib/api";

export interface State {
  id: number;
  name: string;
  code: string;
}

export interface District {
  id: number;
  state_id: number;
  name: string;
}

export interface DistrictCreate {
  name: string;
}

export interface DistrictUpdate {
  name: string;
}

export const locationsApi = {
  getStates: async () => {
    const response = await api.get<State[]>("/api/v1/locations/states");
    return response;
  },

  getDistrictsByState: async (stateId: number) => {
    const response = await api.get<District[]>(
      `/api/v1/locations/states/${stateId}/districts`,
    );
    return response;
  },

  createDistrict: async (stateId: number, data: DistrictCreate) => {
    const response = await api.post<District>(
      `/api/v1/locations/states/${stateId}/districts`,
      data
    );
    return response;
  },

  updateDistrict: async (districtId: number, data: DistrictUpdate) => {
    const response = await api.put<District>(
      `/api/v1/locations/districts/${districtId}`,
      data
    );
    return response;
  },
};
