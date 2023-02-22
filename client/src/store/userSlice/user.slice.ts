import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { UserState } from 'types/store';

const initialState: UserState = {
  user: JSON.parse(localStorage.getItem('user') || 'null') || null,
  token: JSON.parse(localStorage.getItem('token') || 'null') || null,
  loading: false,
  error: undefined,
};

export const login = createAsyncThunk(
  'user/login',
  async ({ username, password }: { username: string; password: string }) => {
    const response = await axios.post(`${process.env.REACT_APP_HT_API_URL}/api/user/login/`, {
      username,
      password,
    });
    return response.data as UserState;
  }
);

/**
 * User logout Redux reducer Function
 *
 * @description on logout, we want to strip all information
 * from browser storage and redux store's state
 * @param    {Object} user UserState
 * @return   {Object}      UserState
 */
function logout(user: UserState) {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  return { ...initialState, user: undefined, token: undefined } as UserState;
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout,
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        return {
          ...state,
          error: undefined,
          loading: true,
        };
      })
      .addCase(login.fulfilled, (state, action) => {
        const authResponse = action.payload;
        // Todo: currently, we store username and jwt token in local storage so
        //  the user stays logged in between page refreshes. This is a known vulnerability to be
        //  fixed in the future. For now, it's a development convenience.
        localStorage.setItem('user', JSON.stringify(authResponse.user));
        localStorage.setItem('token', JSON.stringify(authResponse.token));
        return {
          loading: false,
          error: undefined,
          ...authResponse,
        };
      })
      .addCase(login.rejected, (state, action) => {
        return {
          ...state,
          // @ts-ignore
          error: action.payload.error,
          loading: false,
        };
      });
  },
});

export default userSlice.reducer;
