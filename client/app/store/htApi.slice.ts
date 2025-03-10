import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Manifest } from '~/components/Manifest';
import { QuickerSignature } from '~/components/Manifest/QuickerSign';
import { Code } from '~/components/Manifest/WasteLine/wasteLineSchema';
import { MtnDetails } from '~/components/Mtn';
import { RcraSite } from '~/components/RcraSite';
import { HaztrakSite } from '~/components/Site';
import { htApi } from '~/services';
import { Organization } from '~/store/userApi/userApi';

export interface TaskResponse {
  taskId: string;
}

export interface HtApiQueryArgs {
  url: string;
  method: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  headers?: AxiosRequestConfig['headers'];
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
    HtApiError
    // Meta
  > =>
  async ({ url, method, data, params, headers }) => {
    return htApi({ url: baseUrl + url, method, data, params, headers })
      .then((response) => {
        return { data: response.data };
      })
      .catch((err: AxiosError) => {
        return {
          error: {
            statusText: err.response?.statusText,
            data: err.response?.data || err.message,
          } as HtApiError,
        };
      });
  };

export interface TaskStatus {
  status: 'PENDING' | 'STARTED' | 'SUCCESS' | 'FAILURE' | 'NOT FOUND';
  taskId: string;
  taskName: string;
  createdDate?: string;
  doneDate?: string;
  result?: unknown;
}

interface RcrainfoSiteSearch {
  siteType: 'designatedFacility' | 'generator' | 'transporter' | 'broker';
  siteId: string;
}

export const haztrakApi = createApi({
  tagTypes: ['user', 'auth', 'profile', 'rcrainfoProfile', 'site', 'code', 'manifest', 'org'],
  reducerPath: 'haztrakApi',
  baseQuery: htApiBaseQuery({
    baseUrl: `${import.meta.env.VITE_HT_API_URL}/api/`,
  }),
  endpoints: (build) => ({
    // Note: build.query<ReturnType, ArgType>
    searchRcrainfoSites: build.query<RcraSite[], RcrainfoSiteSearch>({
      query: (data: RcrainfoSiteSearch) => ({
        url: 'rcrainfo/rcrasite/search',
        method: 'post',
        data: data,
      }),
    }),
    searchRcraSites: build.query<RcraSite[], RcrainfoSiteSearch>({
      query: (data: RcrainfoSiteSearch) => ({
        url: 'rcrasite/search',
        method: 'get',
        params: { epaId: data.siteId, siteType: data.siteType },
      }),
    }),
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getRcrainfoSite: build.query<RcraSite, string | void>({
      query: (epaSiteId) => ({
        url: `rcrasite/${epaSiteId}`,
        method: 'get',
      }),
    }),
    getTaskStatus: build.query<TaskStatus, string>({
      query: (taskId) => ({ url: `task/${taskId}`, method: 'get' }),
    }),
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getFedWasteCodes: build.query<Code[], void>({
      query: () => ({ url: 'waste/code/federal', method: 'get' }),
      providesTags: ['code'],
    }),
    getStateWasteCodes: build.query<Code[], string>({
      query: (state) => ({ url: `waste/code/state/${state}`, method: 'get' }),
      providesTags: ['code'],
    }),
    getDotIdNumbers: build.query<string[], string>({
      query: (id) => ({ url: 'waste/dot/id', method: 'get', params: { q: id } }),
      providesTags: ['code'],
    }),
    getOrgSites: build.query<HaztrakSite[], string>({
      query: (id) => ({ url: `orgs/${id}/sites`, method: 'get' }),
      providesTags: ['site'],
    }),
    getOrg: build.query<Organization, string>({
      query: (orgSlug) => ({ url: `orgs/${orgSlug}`, method: 'get' }),
      providesTags: ['org'],
    }),
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getOrgs: build.query<Organization[], void>({
      query: () => ({ url: 'orgs', method: 'get' }),
      providesTags: ['org'],
    }),
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getUserHaztrakSites: build.query<HaztrakSite[], void>({
      query: () => ({ url: 'sites', method: 'get' }),
      providesTags: ['site'],
    }),
    getUserHaztrakSite: build.query<HaztrakSite, string>({
      query: (epaId) => ({ url: `sites/${epaId}`, method: 'get' }),
      providesTags: ['site'],
    }),
    getMTN: build.query<MtnDetails[], string | undefined>({
      query: (siteId) => ({
        url: siteId ? `manifest/mtn/${siteId}` : 'manifest/mtn',
        method: 'get',
      }),
      providesTags: ['manifest'],
    }),
    getManifest: build.query<Manifest, string>({
      query: (mtn) => ({ url: `manifest/${mtn}`, method: 'get' }),
      providesTags: ['manifest'],
    }),
    createManifest: build.mutation<Manifest, Manifest>({
      query: (data) => ({
        url: 'manifest',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['manifest'],
    }),
    updateManifest: build.mutation<Manifest, { mtn: string; manifest: Manifest }>({
      query: ({ mtn, manifest }) => ({
        url: `manifest/${mtn}`,
        method: 'PUT',
        data: manifest,
      }),
      invalidatesTags: ['manifest'],
    }),
    saveEManifest: build.mutation<TaskResponse, Manifest>({
      query: (data) => ({
        url: 'manifest/emanifest',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['manifest'],
    }),
    syncEManifest: build.mutation<TaskResponse, string>({
      query: (siteId) => ({
        url: 'manifest/emanifest/sync',
        method: 'POST',
        data: { siteId: siteId },
      }),
      invalidatesTags: ['manifest'],
    }),
    signEManifest: build.mutation<TaskResponse, QuickerSignature>({
      query: (signature) => ({
        url: 'manifest/emanifest/sign',
        method: 'POST',
        data: signature,
      }),
      invalidatesTags: ['manifest'],
    }),
  }),
});
