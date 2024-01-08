import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { HaztrakSite } from 'components/HaztrakSite';
import { Manifest } from 'components/Manifest';
import { QuickerSignature } from 'components/Manifest/QuickerSign';
import { Code } from 'components/Manifest/WasteLine/wasteLineSchema';
import { MtnDetails } from 'components/Mtn';
import { RcraSite } from 'components/RcraSite';
import { htApi } from 'services';

export interface TaskResponse {
  taskId: string;
}

export interface HtApiQueryArgs {
  url: string;
  method: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
}

export interface HtApiError extends AxiosError {
  data?: AxiosResponse['data'];
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
          statusText: err.response?.statusText,
          data: err.response?.data || err.message,
        } as HtApiError,
      };
    }
  };

export interface TaskStatus {
  status: 'PENDING' | 'STARTED' | 'SUCCESS' | 'FAILURE' | 'NOT FOUND';
  taskId: string;
  taskName: string;
  createdDate?: string;
  doneDate?: string;
  result?: any;
}

interface RcrainfoSiteSearch {
  siteType: 'designatedFacility' | 'generator' | 'transporter' | 'broker';
  siteId: string;
}

export const haztrakApi = createApi({
  tagTypes: ['user', 'auth', 'profile', 'rcrainfoProfile', 'site', 'code', 'manifest'],
  reducerPath: 'haztrakApi',
  baseQuery: htApiBaseQuery({
    baseUrl: `${import.meta.env.VITE_HT_API_URL}/api/`,
  }),
  endpoints: (build) => ({
    // Note: build.query<ReturnType, ArgType>
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
    getRcrainfoSite: build.query<RcraSite, string | null>({
      query: (epaSiteId) => ({
        url: `rcra/handler/${epaSiteId}`,
        method: 'get',
      }),
    }),
    getTaskStatus: build.query<TaskStatus, string>({
      query: (taskId) => ({ url: `task/${taskId}`, method: 'get' }),
    }),
    getFedWasteCodes: build.query<Array<Code>, void>({
      query: () => ({ url: 'rcra/waste/code/federal', method: 'get' }),
      providesTags: ['code'],
    }),
    getStateWasteCodes: build.query<Array<Code>, string>({
      query: (state) => ({ url: `rcra/waste/code/state/${state}`, method: 'get' }),
      providesTags: ['code'],
    }),
    getDotIdNumbers: build.query<Array<string>, string>({
      query: (id) => ({ url: 'rcra/waste/dot/id', method: 'get', params: { q: id } }),
      providesTags: ['code'],
    }),
    getOrgSites: build.query<Array<HaztrakSite>, string>({
      query: (id) => ({ url: `org/${id}/site`, method: 'get' }),
      providesTags: ['site'],
    }),
    getUserHaztrakSites: build.query<Array<HaztrakSite>, void>({
      query: () => ({ url: 'site', method: 'get' }),
      providesTags: ['site'],
    }),
    getUserHaztrakSite: build.query<HaztrakSite, string>({
      query: (epaId) => ({ url: `site/${epaId}`, method: 'get' }),
      providesTags: ['site'],
    }),
    getMTN: build.query<Array<MtnDetails>, string | undefined>({
      query: (siteId) => ({ url: siteId ? `rcra/mtn/${siteId}` : 'rcra/mtn', method: 'get' }),
      providesTags: ['manifest'],
    }),
    getManifest: build.query<Manifest, string>({
      query: (mtn) => ({ url: `rcra/manifest/${mtn}`, method: 'get' }),
      providesTags: ['manifest'],
    }),
    createManifest: build.mutation<Manifest, Manifest>({
      query: (data) => ({
        url: 'rcra/manifest',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['manifest'],
    }),
    updateManifest: build.mutation<Manifest, { mtn: string; manifest: Manifest }>({
      query: ({ mtn, manifest }) => ({
        url: `rcra/manifest/${mtn}`,
        method: 'PUT',
        data: manifest,
      }),
      invalidatesTags: ['manifest'],
    }),
    saveEManifest: build.mutation<TaskResponse, Manifest>({
      query: (data) => ({
        url: 'rcra/manifest/emanifest',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['manifest'],
    }),
    syncEManifest: build.mutation<TaskResponse, string>({
      query: (siteId) => ({
        url: 'rcra/manifest/emanifest/sync',
        method: 'POST',
        data: { siteId: siteId },
      }),
      invalidatesTags: ['manifest'],
    }),
    signEManifest: build.mutation<TaskResponse, QuickerSignature>({
      query: (signature) => ({
        url: 'rcra/manifest/emanifest/sign',
        method: 'POST',
        data: signature,
      }),
      invalidatesTags: ['manifest'],
    }),
  }),
});
