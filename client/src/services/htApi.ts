/**htApi.ts - service for making requests to the Haztrak API*/
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { HaztrakSite } from 'components/HaztrakSite';
import { rootStore } from 'store';
import {
  HaztrakModulePermissions,
  RcrainfoProfile,
  RcrainfoProfileSite,
} from 'store/profileSlice/profile.slice';

interface HaztrakProfileResponse {
  user: string;
  sites: Array<{
    site: HaztrakSite;
    eManifest: HaztrakModulePermissions;
  }>;
}

interface RcrainfoProfileResponse extends RcrainfoProfile<Array<RcrainfoProfileSite>> {}

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
};

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
