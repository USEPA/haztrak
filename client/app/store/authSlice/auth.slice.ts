import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '~/store';
import { userApi } from '~/store/userApi/userApi';

/** The Redux stored information on the current haztrak user*/
export interface AuthSlice {
  isAuthenticated: boolean;
  username: string | null;
  email: string | null;
}

const initialState: AuthSlice = {
  isAuthenticated: false,
  username: null,
  email: null,
};

const slice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(userApi.endpoints.login.matchFulfilled, (state, { payload }) => {
      state.isAuthenticated = true;
      state.username = payload.data.user.username;
      state.email = payload.data.user.email;
    });
    builder.addMatcher(userApi.endpoints.getSession.matchFulfilled, (state, { payload }) => {
      state.isAuthenticated = true;
      state.username = payload.data.user.username;
      state.email = payload.data.user.email;
    });
    builder.addMatcher(userApi.endpoints.getSession.matchRejected, (state, { payload }) => {
      if (payload?.status === 401) {
        state.isAuthenticated = false;
        state.username = null;
        state.email = null;
      }
    });
    builder.addMatcher(userApi.endpoints.getSession.matchPending, (state, { payload }) => {
      state.isAuthenticated = false;
      state.username = null;
      state.email = null;
    });
    builder.addMatcher(userApi.endpoints.logout.matchFulfilled, (state) => {
      state.email = null;
      state.username = null;
      state.isAuthenticated = false;
    });
  },
});

export default slice.reducer;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
