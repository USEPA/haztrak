import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HaztrakUser {
  id?: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  isLoading?: boolean; // ToDO: remove this
  error?: string; // ToDO: remove this
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
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  selectors: {
    selectAuthenticated: (state: AuthSlice): boolean => !!state.token,
    selectUser: (state: AuthSlice): HaztrakUser | undefined => state.user,
    selectUserName: (state: AuthSlice): string | undefined => state.user?.username,
  },
  reducers: {
    setCredentials(state: AuthSlice, action: PayloadAction<{ token: string }>) {
      const { token } = action.payload;
      localStorage.setItem('token', JSON.stringify(token));
      return {
        ...state,
        token,
      } as AuthSlice;
    },
    removeCredentials(): AuthSlice {
      localStorage.removeItem('token');
      return { ...initialState, user: undefined, token: undefined };
    },
  },
});

export default authSlice.reducer;
export const { removeCredentials, setCredentials } = authSlice.actions;
export const { selectAuthenticated, selectUser, selectUserName } = authSlice.selectors;
