import { BaseQueryFn } from '@reduxjs/toolkit/dist/query/react';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { htApi } from 'services';

export interface HtApiQueryArgs {
  url: string;
  method: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
}

export interface HtApiError {
  status?: number;
  data?: AxiosResponse['data'];
  code?: string;
  statusText?: string;
}

/**
 * Used by the RTK Query createApi, so we can hook into our htApi service
 * for user authentication between the client and server.
 *
 * For information on custom RTK baseQuery types, see:
 * https://redux-toolkit.js.org/rtk-query/usage-with-typescript#typing-a-basequery
 * @param baseUrl
 */
export const htApiBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '/' }
  ): BaseQueryFn<
    HtApiQueryArgs, // Args
    unknown, // Result
    HtApiError, // Error
    {}, // DefinitionExtraOptions
    {} // Meta
  > =>
  async ({ url, method, data, params }) => {
    try {
      const response = await htApi({ url: baseUrl + url, method, data, params });
      return { data: response.data };
    } catch (axiosError) {
      let err = axiosError as AxiosError;
      return {
        error: {
          cose: err.code,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data || err.message,
        } as HtApiError,
      };
    }
  };
