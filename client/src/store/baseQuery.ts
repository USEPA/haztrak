import { BaseQueryFn } from '@reduxjs/toolkit/dist/query/react';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { htApi } from 'services';

/**
 * Used by the RTK Query createApi, so we can hook into our htApi service
 * for user authentication between the client and server.
 * @param baseUrl
 */
export const htApiBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '/' }
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }) => {
    try {
      const result = await htApi({ url: baseUrl + url, method, data, params });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
