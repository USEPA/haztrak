import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import htApi from 'services';
import { UserState } from 'types/store';

const initialState: UserState = {
  user: JSON.parse(localStorage.getItem('user') || 'null') || null,
  token: JSON.parse(localStorage.getItem('token') || 'null') || null,
  rcraAPIID: '',
  rcraAPIKey: '',
  epaSites: [],
  phoneNumber: undefined,
  loading: false,
  error: undefined,
};

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await htApi.get('user/profile');
  return response.data as UserState;
});

export const login = createAsyncThunk(
  'user/login',
  async ({ username, password }: { username: string; password: string }) => {
    const response = await htApi.post('user/login/', {
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
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.rcraAPIID = action.payload.rcraAPIID;
        state.rcraAPIKey = action.payload.rcraAPIKey;
        state.phoneNumber = action.payload.phoneNumber;
        state.epaSites = action.payload.epaSites;
        state.error = undefined;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        // Todo
        // @ts-ignore
        state.error = action.payload.error;
      })
      .addCase(login.pending, (state, action) => {
        state.error = undefined;
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        const authResponse = action.payload;
        // Todo: currently, we store username and jwt token in local storage so
        //  the user stays logged in between page refreshes. This is a vulnerability
        localStorage.setItem('user', JSON.stringify(authResponse.user));
        localStorage.setItem('token', JSON.stringify(authResponse.token));
        state.user = authResponse.user;
        state.token = authResponse.token;
      })
      .addCase(login.rejected, (state, action) => {
        // Todo
        // @ts-ignore
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
