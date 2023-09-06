import { createApi } from '@reduxjs/toolkit/query/react';
import { htApiBaseQuery } from 'store/baseQuery';

/**
 * A RTK Query Api for fetching codes.
 * the createApi function takes automatically generates react hooks,
 */
export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: htApiBaseQuery({
    baseUrl: `${import.meta.env.VITE_HT_API_URL}/api/task/`,
  }),
  endpoints: (build) => ({
    getTaskStatus: build.query({
      query: (taskId) => ({ url: `${taskId}`, method: 'get' }),
    }),
    getTaskStatus2: build.query({
      query: (taskId) => ({ url: `status/${taskId}`, method: 'get' }),
    }),
  }),
});

export const { useGetTaskStatusQuery, useGetTaskStatus2Query } = taskApi;
