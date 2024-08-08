import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '~/store';
import { userApi } from '~/store/userSlice/user.slice';

export interface HaztrakUser {
  id?: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

/** The Redux stored information on the current haztrak user*/
export interface AuthSlice {
  user: HaztrakUser | null;
  token: string | null;
}

const initialState: AuthSlice = {
  user: null,
  token: null,
};

const slice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(userApi.endpoints.login.matchFulfilled, (state, { payload }) => {
      state.token = payload.access;
      state.user = payload.user;
    });
    builder.addMatcher(userApi.endpoints.getUser.matchFulfilled, (state, { payload }) => {
      state.user = payload;
    });
    builder.addMatcher(userApi.endpoints.logout.matchFulfilled, (state) => {
      state.user = null;
      state.token = null;
    });
    builder.addMatcher(userApi.endpoints.getUser.matchRejected, (state, { payload }) => {
      if (payload?.status === 401) {
        state.user = null;
        state.token = null;
      }
    });
  },
});

export default slice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
