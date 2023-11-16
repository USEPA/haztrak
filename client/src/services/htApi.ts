/**htApi.ts - service for making requests to the Haztrak API*/
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { rootStore } from 'store';

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
