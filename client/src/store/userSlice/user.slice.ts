import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { HaztrakSite } from 'components/HaztrakSite';
import { htApiBaseQuery } from 'store/haztrakApiSlice';
import {
  HaztrakModulePermissions,
  ProfileSlice,
  RcrainfoProfile,
  RcrainfoProfileSite,
  RcrainfoProfileState,
} from 'store/profileSlice/profile.slice';

export interface HaztrakUser {
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  isLoading?: boolean;
  error?: string;
}

/**
 * The Redux stored information on the current haztrak user
 */
export interface UserSlice {
  user?: HaztrakUser;
  token?: string;
  loading?: boolean;
  error?: string;
}

const initialState: UserSlice = {
  user: { username: JSON.parse(localStorage.getItem('user') || 'null') || null, isLoading: false },
  token: JSON.parse(localStorage.getItem('token') || 'null') || null,
  loading: false,
  error: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  selectors: {
    selectAuthenticated: (state: UserSlice): boolean => !!state.token,
    selectUser: (state: UserSlice): HaztrakUser | undefined => state.user,
    selectUserName: (state: UserSlice): string | undefined => state.user?.username,
  },
  reducers: {
    setCredentials(state: UserSlice, action: PayloadAction<{ token: string }>) {
      const token = action.payload.token;
      localStorage.setItem('token', JSON.stringify(token));
      return {
        ...state,
        token,
      } as UserSlice;
    },
    logout(state: UserSlice): UserSlice {
      localStorage.removeItem('token');
      return { ...initialState, user: undefined, token: undefined };
    },
    updateUserProfile(state: UserSlice, action: PayloadAction<HaztrakUser>) {
      return {
        ...state,
        user: action.payload,
      };
    },
  },
});

export default authSlice.reducer;
export const { updateUserProfile, logout, setCredentials } = authSlice.actions;
export const { selectAuthenticated, selectUser, selectUserName } = authSlice.selectors;

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  key: string;
}

interface HaztrakOrgResponse {
  id: string;
  name: string;
  rcrainfoIntegrated: boolean;
}

interface HaztrakProfileResponse {
  user: string;
  sites: Array<{
    site: HaztrakSite;
    eManifest: HaztrakModulePermissions;
  }>;
  org?: HaztrakOrgResponse;
}

interface RcrainfoProfileResponse extends RcrainfoProfile<Array<RcrainfoProfileSite>> {}

export const authApi = createApi({
  tagTypes: ['user', 'auth', 'profile', 'rcrainfoProfile'],
  reducerPath: 'authApi',
  baseQuery: htApiBaseQuery({
    baseUrl: `${import.meta.env.VITE_HT_API_URL}/api/user`,
  }),
  endpoints: (build) => ({
    // Note: build.query<ReturnType, ArgType>
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: '/login',
        method: 'POST',
        data: data,
      }),
      invalidatesTags: ['auth'],
    }),
    getUser: build.query<HaztrakUser, void>({
      query: () => ({
        url: '',
        method: 'GET',
      }),
      providesTags: ['user'],
    }),
    updateUser: build.mutation<HaztrakUser, HaztrakUser>({
      query: (data) => ({
        url: '',
        method: 'PUT',
        data: data,
      }),
      invalidatesTags: ['user'],
    }),
    getProfile: build.query<ProfileSlice, void>({
      query: () => ({
        url: '/profile',
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
        url: `/rcrainfo-profile/${username}`,
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
  }),
});
