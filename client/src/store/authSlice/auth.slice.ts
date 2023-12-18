import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/rootStore';
import { haztrakApi } from 'store/haztrakApiSlice';

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
export interface AuthSlice {
  user?: HaztrakUser;
  token?: string;
  loading?: boolean;
  error?: string;
}

const initialState: AuthSlice = {
  user: { username: JSON.parse(localStorage.getItem('user') || 'null') || null, isLoading: false },
  token: JSON.parse(localStorage.getItem('token') || 'null') || null,
  loading: false,
  error: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  selectors: {
    selectAuthenticated: (state: AuthSlice): boolean => !!state.token,
    selectUser: (state: AuthSlice): HaztrakUser | undefined => state.user,
    selectUserName: (state: AuthSlice): string | undefined => state.user?.username,
  },
  reducers: {
    setCredentials(state: AuthSlice, action: PayloadAction<{ token: string }>) {
      const token = action.payload.token;
      localStorage.setItem('token', JSON.stringify(token));
      return {
        ...state,
        token,
      } as AuthSlice;
    },
    logout(state: AuthSlice): AuthSlice {
      localStorage.removeItem('token');
      return { ...initialState, user: undefined, token: undefined };
    },
    updateUserProfile(state: AuthSlice, action: PayloadAction<HaztrakUser>) {
      return {
        ...state,
        user: action.payload,
      };
    },
  },
});

/** Get the current user's username from the Redux store*/
export const selectUserName = (state: RootState): string | undefined => state.auth.user?.username;

/** Select the current user*/
export const selectUser = (state: RootState): HaztrakUser | undefined => state.auth.user;

export default authSlice.reducer;
export const { updateUserProfile, logout, setCredentials } = authSlice.actions;
export const { selectAuthenticated } = authSlice.selectors;

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  key: string;
}

export const authApi = haztrakApi.injectEndpoints({
  endpoints: (build) => ({
    // Note: build.query<ReturnType, ArgType>
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: 'auth/login',
        method: 'POST',
        data: data,
      }),
    }),
    getUser: build.query<HaztrakUser, void>({
      query: () => ({
        url: 'user',
        method: 'GET',
      }),
    }),
  }),
});
