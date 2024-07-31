/**htApi.ts - service for making requests to the Haztrak API*/
import axios, { InternalAxiosRequestConfig } from 'axios';
import { rootStore } from '~/store';

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
    const token = rootStore.getState().auth.token;
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
