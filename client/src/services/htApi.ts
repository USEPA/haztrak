/**htApi.ts - service for making requests to the Haztrak API*/
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { HaztrakSite } from 'components/HaztrakSite';
import { rootStore } from 'store';
import {
  HaztrakModulePermissions,
  RcrainfoProfile,
  RcrainfoProfileSite,
} from 'store/profileSlice/profile.slice';
import { HaztrakUser } from 'store/userSlice/user.slice';
import { an } from 'vitest/dist/reporters-5f784f42';

interface HaztrakOrgResponse {
  id: string;
  name: string;
  rcrainfoIntegrated: boolean;
}

interface HaztrakProfileResponse {
  user: string;
  sites: Array<{
    site: HaztrakSite;
    eManifest: HaztrakModulePermissions;
  }>;
  org?: HaztrakOrgResponse;
}

interface RcrainfoProfileResponse extends RcrainfoProfile<Array<RcrainfoProfileSite>> {}

/** An Axios instance with an interceptor to automatically apply authentication headers*/
export const htApi = axios.create({
  baseURL: `${import.meta.env.VITE_HT_API_URL}/api`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

/**interceptor to apply auth token from redux store*/
htApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers = config.headers ?? {};
    const token = rootStore.getState().user.token;
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**interceptor to add errors to redux state*/
htApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export const HtApi = {
  /** Fetch the user's Haztrak profile from the Haztrak API*/
  getUserProfile: async (): Promise<AxiosResponse<HaztrakProfileResponse>> => {
    return await htApi.get('/profile');
  },

  /** Fetch the user's RCRAInfo profile from the Haztrak API*/
  getRcrainfoProfile: async (username: string): Promise<AxiosResponse<RcrainfoProfileResponse>> => {
    return await htApi.get(`/rcra/profile/${username}`);
  },

  /** Update user's RCRAInfo Profile information such username, api ID & key*/
  updateRcrainfoProfile: async ({
    username,
    data,
  }: {
    username: string;
    data: any;
  }): Promise<AxiosResponse<any>> => {
    return await htApi.put(`/rcra/profile/${username}`, data);
  },

  /** Launch task to pull user's site/module permissions (RCRAInfo profile) from RCRAInfo*/
  syncRcrainfoProfile: async (): Promise<AxiosResponse<{ taskId: string }>> => {
    return await htApi.get(`rcra/profile/sync`);
  },

  /** Fetch Haztrak user from server*/
  getUser: async (): Promise<AxiosResponse<HaztrakUser>> => {
    return await htApi.get('/user');
  },
};
