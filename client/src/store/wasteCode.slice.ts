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
    baseUrl: `${import.meta.env.VITE_HT_API_URL}/api/rcra/code/`,
  }),
  endpoints: (build) => ({
    getFedWasteCodes: build.query<Array<Code>, void>({
      query: () => ({ url: 'waste/federal', method: 'get' }),
    }),
    getStateWasteCodes: build.query<Array<Code>, string>({
      query: (state) => ({ url: `waste/state/${state}`, method: 'get' }),
    }),
    //  ToDo: getDOTIdNumbers endpoint
  }),
});

export const { useGetFedWasteCodesQuery, useGetStateWasteCodesQuery } = wasteCodeApi;
