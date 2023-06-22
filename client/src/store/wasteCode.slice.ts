import { createApi } from '@reduxjs/toolkit/query/react';
import { htApiBaseQuery } from 'store/baseQuery';
import { Code } from 'components/Manifest/WasteLine/wasteLineSchema';

/**
 * A RTK Query Api for fetching codes.
 * the createApi function takes automatically generates react hooks,
 */
export const wasteCodeApi = createApi({
  reducerPath: 'wasteCodeApi',
  baseQuery: htApiBaseQuery({
    baseUrl: `${import.meta.env.VITE_HT_API_URL}/api/code/`,
  }),
  endpoints: (build) => ({
    getFedWasteCodes: build.query<Array<Code>, void>({
      query: () => ({ url: 'waste/federal', method: 'get' }),
    }),
  }),
});

export const { useGetFedWasteCodesQuery } = wasteCodeApi;
