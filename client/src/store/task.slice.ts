import { createApi } from '@reduxjs/toolkit/query/react';
import { htApiBaseQuery } from 'store/baseQuery';

export interface TaskStatus {
  status: 'PENDING' | 'STARTED' | 'SUCCESS' | 'FAILURE' | 'NOT FOUND';
  taskId: string;
  taskName: string;
  createdDate?: string;
  doneDate?: string;
}

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
    getTaskStatus: build.query<TaskStatus, string>({
      query: (taskId) => ({ url: `${taskId}`, method: 'get' }),
    }),
  }),
});

export const { useGetTaskStatusQuery } = taskApi;
