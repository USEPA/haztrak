import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services';
import history from '../utils';

export interface UserState {
  user: string | null;
  token: string | null;
  rcraAPIID: string | null;
  rcraAPIKey: string | null;
  epaSites: string[];
  phoneNumber: string;
  loading: boolean;
  error: string;
}

const initialState: UserState = {
  user: JSON.parse(localStorage.getItem('user') || 'null') || null,
  token: JSON.parse(localStorage.getItem('token') || 'null') || null,
  rcraAPIID: '',
  rcraAPIKey: '',
  epaSites: [],
  phoneNumber: '',
  loading: false,
  error: '',
};

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response: UserState = await api.get('user/profile/', null);
  return response as UserState;
});

export const login = createAsyncThunk(
  'user/login',
  async ({ username, password }: { username: string; password: string }) => {
    const response: UserState = await api.post('user/login/', {
      username,
      password,
    });
    return response as UserState;
  }
);

/**
 * Reducer Function that logs user out
 * @param    {Object} user User state
 * @return   {Object}      Updated state
 */
function logout(user: UserState) {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  user = initialState;
  // @ts-ignore
  history.navigate('/login');
  return user as UserState;
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout,
  },
  extraReducers: (builder) => {
    builder.addCase(getUser.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.rcraAPIID = action.payload.rcraAPIID;
      state.rcraAPIKey = action.payload.rcraAPIKey;
      state.phoneNumber = action.payload.phoneNumber;
      state.epaSites = action.payload.epaSites;
      state.error = '';
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.loading = false;
      // Todo
      // @ts-ignore
      state.error = action.payload.error;
    });
    builder.addCase(login.pending, (state, action) => {
      state.error = '';
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      const authResponse = action.payload;
      // store user details and jwt token in local storage to
      // keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(authResponse.user));
      localStorage.setItem('token', JSON.stringify(authResponse.token));
      state.user = authResponse.user;
      state.token = authResponse.token;

      // get return url from location state or default to home page
      // @ts-ignore
      const { from } = history.location.state || { from: { pathname: '/' } };
      // Todo
      // @ts-ignore
      history.navigate(from);
    });
    builder.addCase(login.rejected, (state, action) => {
      // Todo
      // @ts-ignore
      state.error = action.payload.error;
    });
  },
});

export const userReducers = userSlice.reducer;
