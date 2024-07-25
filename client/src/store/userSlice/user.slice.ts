import { HaztrakSite } from 'components/HaztrakSite';
import { HaztrakUser } from 'store/authSlice/auth.slice';
import { haztrakApi, TaskResponse } from 'store/htApi.slice';

/**The user's RCRAInfo account data stored in the Redux store*/
export interface ProfileSlice {
  user: string | undefined;
  rcrainfoProfile?: RcrainfoProfile<Record<string, RcrainfoProfileSite>>;
  sites?: Record<string, HaztrakProfileSite>;
  org?: HaztrakProfileOrg | null;
  loading?: boolean;
  error?: string;
}

export interface HaztrakProfileOrg {
  id: string;
  name: string;
  rcrainfoIntegrated: boolean;
}

/** A site a user has access to in RCRAInfo and their module permissions */
export interface RcrainfoProfileSite {
  epaSiteId: string;
  permissions: RcrainfoSitePermissions;
}

export interface HaztrakProfileSite extends HaztrakSite {
  permissions: HaztrakSitePermissions;
}

export type HaztrakModulePermissions = 'viewer' | 'editor' | 'signer';

export interface HaztrakSitePermissions {
  eManifest: HaztrakModulePermissions;
}

export interface RcrainfoProfileState
  extends RcrainfoProfile<Record<string, RcrainfoProfileSite>> {}

export interface RcrainfoProfile<T> {
  user: string;
  rcraAPIID?: string;
  rcraUsername?: string;
  rcraAPIKey?: string;
  apiUser?: boolean;
  rcraSites?: T;
  phoneNumber?: string;
  isLoading?: boolean;
  error?: string;
}

export interface RcrainfoSitePermissions {
  siteManagement: boolean;
  annualReport: string;
  biennialReport: string;
  eManifest: string;
  WIETS: string;
  myRCRAid: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  key: string;
}

interface HaztrakOrgResponse {
  id: string;
  name: string;
  rcrainfoIntegrated: boolean;
}

export interface HaztrakProfileResponse {
  user: string;
  sites: Array<{
    site: HaztrakSite;
    eManifest: HaztrakModulePermissions;
  }>;
  org?: HaztrakOrgResponse;
}

interface RcrainfoProfileResponse extends RcrainfoProfile<Array<RcrainfoProfileSite>> {}

export const userApi = haztrakApi.injectEndpoints({
  endpoints: (build) => ({
    // Note: build.query<ReturnType, ArgType>
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: 'user/login',
        method: 'POST',
        data: data,
      }),
      invalidatesTags: ['auth'],
    }),
    logout: build.mutation({
      query: () => ({
        url: 'user/logout',
        method: 'POST',
      }),
      invalidatesTags: ['auth'],
    }),
    getUser: build.query<HaztrakUser, void>({
      query: () => ({
        url: 'user',
        method: 'GET',
      }),
      providesTags: ['user'],
    }),
    updateUser: build.mutation<HaztrakUser, HaztrakUser>({
      query: (data) => ({
        url: 'user',
        method: 'PUT',
        data: data,
      }),
      invalidatesTags: ['user'],
    }),
    getProfile: build.query<ProfileSlice, void>({
      query: () => ({
        url: 'profile',
        method: 'GET',
      }),
      providesTags: ['profile'],
      transformResponse: (response: HaztrakProfileResponse) => {
        const sites = response.sites.reduce((obj, site) => {
          return {
            ...obj,
            [site.site.handler.epaSiteId]: {
              ...site.site,
              permissions: { eManifest: site.eManifest },
            },
          };
        }, {});
        return {
          user: response.user,
          org: response.org,
          sites: sites,
        };
      },
    }),
    getRcrainfoProfile: build.query<RcrainfoProfileState, string>({
      query: (username) => ({
        url: `rcrainfo-profile/${username}`,
        method: 'GET',
      }),
      providesTags: ['rcrainfoProfile'],
      transformResponse: (response: RcrainfoProfileResponse) => {
        const rcraSites = response?.rcraSites;
        return {
          ...response,
          rcraSites: rcraSites?.reduce((obj, site) => {
            return {
              ...obj,
              [site.epaSiteId]: { epaSiteId: site.epaSiteId, permissions: site.permissions },
            };
          }, {}),
        };
      },
    }),
    updateRcrainfoProfile: build.mutation<any, { username: string; data: any }>({
      query: (data) => ({
        url: `rcrainfo-profile/${data.username}`,
        method: 'PUT',
        data: data.data,
      }),
      invalidatesTags: ['rcrainfoProfile'],
    }),
    syncRcrainfoProfile: build.mutation<TaskResponse, void>({
      query: () => ({
        url: `rcrainfo-profile/sync`,
        method: 'POST',
      }),
      invalidatesTags: ['rcrainfoProfile'],
    }),
  }),
});
