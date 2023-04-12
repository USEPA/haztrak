import { BaseQueryFn } from '@reduxjs/toolkit/dist/query/react';
import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosError, AxiosRequestConfig } from 'axios';
import htApi from 'services/HtApi';
import { Code } from 'types/wasteLine';

/**
 * Used by the RTK Query api to hook into our existing htApi
 * for existing interceptor for user authentication
 * @param baseUrl
 */
const htApiBaseQuery =
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

/**
 * A RTK Query Api for fetching codes.
 * the createApi function takes autmatically generates react hooks,
 */
export const wasteCodeApi = createApi({
  reducerPath: 'wasteCodeApi',
  baseQuery: htApiBaseQuery({
    baseUrl: `${process.env.REACT_APP_HT_API_URL}/api/trak/code/`,
  }),
  endpoints: (build) => ({
    getWasteCodes: build.query<Array<Code>, string>({
      query: (type) => ({ url: `waste/${type}`, method: 'get' }),
    }),
  }),
});

export const { useGetWasteCodesQuery } = wasteCodeApi;
