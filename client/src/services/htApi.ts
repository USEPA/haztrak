/**htApi.ts - service for making requests to the Haztrak API*/
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { HaztrakSite } from 'components/HaztrakSite';
import { addNotification, rootStore } from 'store';
import {
  HaztrakModulePermissions,
  RcrainfoProfile,
  RcrainfoProfileSite,
} from 'store/profileSlice/profile.slice';
import { HaztrakUser } from 'store/userSlice/user.slice';

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
  /** Retrieve the user's Haztrak profile from the Haztrak API*/
  getUserProfile: async () => {
    const response: AxiosResponse<HaztrakProfileResponse> = await htApi.get('/profile');
    return response.data;
  },
  /** Retrieve the user's RCRAInfo profile from the Haztrak API*/
  getUserRcrainfoProfile: async (username: string) => {
    const response: AxiosResponse<RcrainfoProfileResponse> = await htApi.get(
      `/rcra/profile/${username}`
    );
    return response.data;
  },
  /** Launch task to pull user's site/module permissions (RCRAInfo profile) from RCRAInfo*/
  syncRcrainfoProfile: async () => {
    const response: AxiosResponse<{ taskId: string }> = await htApi.get(`rcra/profile/sync`);
    return response.data;
  },

  /** Retrieve Haztrak user server*/
  getUser: async () => {
    const response: AxiosResponse<HaztrakUser> = await htApi.get('/user');
    return response.data;
  },
};
