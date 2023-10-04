/**
 * @file axios (http) instance for haztrak restful API usage
 */
import axios, { InternalAxiosRequestConfig } from 'axios';
import { rootStore } from 'store';

export const htApi = axios.create({
  baseURL: `${import.meta.env.VITE_HT_API_URL}/api`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

/**
 * The axios intercept to apply to all requests to the Haztrak server
 */
htApi.interceptors.request.use(
  /**
   * Use the redux store to get the token and set Authorization header
   */
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
