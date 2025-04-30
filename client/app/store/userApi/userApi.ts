import { HaztrakSite } from '~/components/Site';
import { HaztrakUser } from '~/store/authSlice/auth.slice';
import { TaskResponse, haztrakApi } from '~/store/htApi.slice';

/**The user's RCRAInfo account data stored in the Redux store*/
export interface ProfileSlice {
  user: HaztrakUser;
  rcrainfoProfile?: RcrainfoProfile<Record<string, RcrainfoProfileSite>>;
  sites?: Record<string, HaztrakProfileSite>;
  org?: Organization | null;
  avatar?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
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

export type RcrainfoProfileState = RcrainfoProfile<Record<string, RcrainfoProfileSite>>;

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

export interface AuthSuccessResponse {
  status: number;
  data: {
    user: {
      id: string;
      display: string;
      has_usable_password: boolean;
      email: string;
      username: string;
    };
    methods: {
      method: string;
      at: number;
      username: string;
    }[];
    meta: {
      is_authenticated: boolean;
    };
  };
}

export interface HaztrakProfileResponse {
  user: string;
  sites: {
    site: HaztrakSite;
    eManifest: HaztrakModulePermissions;
  }[];
  org?: Organization;
}

type RcrainfoProfileResponse = RcrainfoProfile<RcrainfoProfileSite[]>;

export const userApi = haztrakApi.injectEndpoints({
  endpoints: (build) => ({
    // Note: build.query<ReturnType, ArgType>
    login: build.mutation<AuthSuccessResponse, LoginRequest>({
      query: (data) => ({
        url: '_allauth/browser/v1/auth/login',
        method: 'POST',
        data: data,
      }),
      invalidatesTags: ['user', 'auth'],
    }),
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    logout: build.mutation<void, void>({
      query: () => ({
        url: '_allauth/browser/v1/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['user', 'auth'],
    }),
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getUser: build.query<HaztrakUser, void>({
      query: () => ({
        url: 'auth/user/',
        method: 'GET',
      }),
      providesTags: ['user'],
    }),
    getSession: build.query<HaztrakUser, void>({
      query: () => ({
        url: '_allauth/browser/v1/auth/session',
        method: 'GET',
      }),
      providesTags: ['auth', 'user'],
    }),

    updateUser: build.mutation<HaztrakUser, HaztrakUser>({
      query: (data) => ({
        url: 'auth/user/',
        method: 'PUT',
        data: data,
      }),
      invalidatesTags: ['user'],
    }),
    updateProfile: build.mutation<ProfileSlice, { id: string; profile: Partial<ProfileSlice> }>({
      query: ({ id, profile }) => ({
        url: `profile/${id}`,
        method: 'PATCH',
        data: profile,
      }),
      invalidatesTags: ['profile'],
    }),
    updateAvatar: build.mutation<{ avatar: string }, { id: string; avatar: FormData }>({
      query: ({ id, avatar }) => ({
        url: `profile/${id}`,
        method: 'PATCH',
        data: avatar,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      invalidatesTags: ['profile'],
    }),
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getProfile: build.query<ProfileSlice, void>({
      query: () => ({
        url: 'my-profile',
        method: 'GET',
      }),
      providesTags: ['profile'],
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
    updateRcrainfoProfile: build.mutation<unknown, { username: string; data: unknown }>({
      query: (data) => ({
        url: `rcrainfo-profile/${data.username}`,
        method: 'PUT',
        data: data.data,
      }),
      invalidatesTags: ['rcrainfoProfile'],
    }),
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    syncRcrainfoProfile: build.mutation<TaskResponse, void>({
      query: () => ({
        url: `rcrainfo-profile/sync`,
        method: 'POST',
      }),
      invalidatesTags: ['rcrainfoProfile'],
    }),
  }),
});
