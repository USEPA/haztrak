import { createApi } from '@reduxjs/toolkit/query/react';
import { RcraSite } from 'components/RcraSite';
import { htApiBaseQuery } from 'store/baseQuery';

interface RcrainfoSiteSearch {
  siteType: string;
  siteId: string;
}

/**
 * A RTK Query Api for fetching codes.
 * the createApi function takes automatically generates react hooks,
 */
export const siteApi = createApi({
  reducerPath: 'siteApi',
  baseQuery: htApiBaseQuery({
    baseUrl: `${import.meta.env.VITE_HT_API_URL}/api/`,
  }),
  endpoints: (build) => ({
    searchRcrainfoSites: build.query<Array<RcraSite>, RcrainfoSiteSearch>({
      query: (data: RcrainfoSiteSearch) => ({
        url: 'rcra/handler/search',
        method: 'post',
        data: data,
      }),
    }),
    searchRcraSites: build.query<Array<RcraSite>, RcrainfoSiteSearch>({
      query: (data: RcrainfoSiteSearch) => ({
        url: 'site/search',
        method: 'get',
        params: { epaId: data.siteId, siteType: data.siteType },
      }),
    }),
  }),
});
