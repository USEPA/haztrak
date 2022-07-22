import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services';
import history from '../utils';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')),
  token: JSON.parse(localStorage.getItem('token')),
  rcraAPIID: null,
  rcraAPIKey: null,
  epaSites: [],
  phoneNumber: null,
  loading: false,
  error: null,
};

export const getUser = createAsyncThunk('user/getUser', async () =>
  api.get('user/profile/', null)
);

export const login = createAsyncThunk(
  'user/login',
  async ({ username, password }) =>
    api.post('user/login/', {
      username,
      password,
    })
);

/**
 * Reducer Function that logs user out
 * @param    {Object} user User state
 * @return   {Object}      Updated state
 */
function logout(user) {
  user = initialState;
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  history.navigate('/login');
  return user;
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout,
  },
  extraReducers: {
    [getUser.pending]: (user) => {
      user.loading = true;
      user.error = null;
    },
    [getUser.fulfilled]: (user, { payload }) => {
      user.loading = false;
      user.user = payload.user;
      user.rcraAPIID = payload.rcraAPIID;
      user.rcraAPIKey = payload.rcraAPIKey;
      user.phoneNumber = payload.phoneNumber;
      user.epaSites = payload.epaSites;
      user.error = null;
    },
    [getUser.rejected]: (user, { payload }) => {
      user.loading = false;
      user.error = payload.error;
    },
    [login.pending]: (state) => {
      state.error = null;
    },
    [login.fulfilled]: (state, action) => {
      const authResponse = action.payload;
      // store user details and jwt token in local storage to
      // keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(authResponse.user));
      localStorage.setItem('token', JSON.stringify(authResponse.token));
      state.user = authResponse.user;
      state.token = authResponse.token;

      // get return url from location state or default to home page
      const { from } = history.location.state || { from: { pathname: '/' } };
      history.navigate(from);
    },
    [login.rejected]: (state, action) => {
      state.error = action.error;
    },
  },
});

export const userReducers = userSlice.reducer;
