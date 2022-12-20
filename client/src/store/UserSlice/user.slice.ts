import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import htApi from 'services';
import { UserState } from 'types/store';

const initialState: UserState = {
  user: JSON.parse(localStorage.getItem('user') || 'null') || null,
  token: JSON.parse(localStorage.getItem('token') || 'null') || null,
  rcraAPIID: '',
  rcraAPIKey: '',
  rcraUsername: undefined,
  epaSites: [],
  phoneNumber: undefined,
  email: undefined,
  loading: false,
  error: undefined,
};

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await htApi.get('trak/profile');
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
        return {
          ...state,
          loading: true,
          error: undefined,
        };
      })
      .addCase(getUser.fulfilled, (state, action) => {
        console.log('getUser: \n', action.payload);
        return {
          ...state,
          ...action.payload,
          epaSites: ['blah', 'blah'], // Temporary: Remove
          error: undefined,
          loading: false,
        };
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        // Todo: remove ts-ignore
        // @ts-ignore
        state.error = action.payload.error;
        return state;
      })
      .addCase(login.pending, (state, action) => {
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
        state.user = authResponse.user;
        state.token = authResponse.token;
        return state;
      })
      .addCase(login.rejected, (state, action) => {
        // Todo
        // @ts-ignore
        state.error = action.error.message;
        return state;
      });
  },
});

export default userSlice.reducer;
