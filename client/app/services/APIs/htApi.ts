/**htApi.ts - service for making requests to the Haztrak API*/
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { rootStore } from '~/store';
import { redirect } from 'react-router-dom';

/** An Axios instance with an interceptor to automatically apply authentication headers*/
export const htApi = axios.create({
  baseURL: `${import.meta.env.VITE_HT_API_URL}/api`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFTOKEN',
  withCredentials: true,
});

/**interceptor to apply auth token from redux store*/
htApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers = config.headers ?? {};
    const token = rootStore.getState().auth.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const returnOnSuccess = (response: AxiosResponse) => response;

export const redirectOnUnauthorized = (error: AxiosError) => {
  if (error.response?.status === 401) {
    redirect('/login');
  }
  return Promise.reject(error);
};

htApi.interceptors.response.use(returnOnSuccess, redirectOnUnauthorized);
