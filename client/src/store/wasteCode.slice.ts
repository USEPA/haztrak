import { createApi } from '@reduxjs/toolkit/query/react';
import { Code } from 'components/Manifest/WasteLine/wasteLineSchema';
import { htApiBaseQuery } from 'store/baseQuery';

/**
 * A RTK Query Api for fetching codes.
 * the createApi function takes automatically generates react hooks,
 */
export const wasteCodeApi = createApi({
  reducerPath: 'wasteCodeApi',
  baseQuery: htApiBaseQuery({
    baseUrl: `${import.meta.env.VITE_HT_API_URL}/api/rcra/waste/`,
  }),
  endpoints: (build) => ({
    getFedWasteCodes: build.query<Array<Code>, void>({
      query: () => ({ url: 'code/federal', method: 'get' }),
    }),
    getStateWasteCodes: build.query<Array<Code>, string>({
      query: (state) => ({ url: `code/state/${state}`, method: 'get' }),
    }),
    getDotIdNumbers: build.query<Array<string>, string>({
      query: (id) => ({ url: 'dot/id', method: 'get', params: { q: id } }),
    }),
  }),
});

export const { useGetFedWasteCodesQuery, useGetStateWasteCodesQuery } = wasteCodeApi;
