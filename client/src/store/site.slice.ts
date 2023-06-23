import { createApi } from '@reduxjs/toolkit/query/react';
import { htApiBaseQuery } from 'store/baseQuery';
import { RcraSite } from 'components/RcraSite';

/**
 * A RTK Query Api for fetching codes.
 * the createApi function takes automatically generates react hooks,
 */
export const siteApi = createApi({
  reducerPath: 'siteApi',
  baseQuery: htApiBaseQuery({
    baseUrl: `${import.meta.env.VITE_HT_API_URL}/api/site/`,
  }),
  endpoints: (build) => ({
    searchRcraSites: build.query<Array<RcraSite>, void>({
      query: () => ({ url: 'rcrainfo/search', method: 'get' }),
    }),
  }),
});

export const { useSearchRcraSitesQuery } = siteApi;
