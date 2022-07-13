// SO much wrong with this file
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import history from '_helpers';
import api from '../_services';

// create slice
const name = 'auth';

// implementation
function createInitialState() {
  return {
    // initialize state from local storage to enable user to stay logged in
    user: JSON.parse(localStorage.getItem('user')),
    token: JSON.parse(localStorage.getItem('token')),
    error: null,
  };
}

function createReducers() {
  function logout(state) {
    state.user = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    history.navigate('/login');
  }

  return {
    logout,
  };
}

function createExtraActions() {
  function login() {
    return createAsyncThunk(
      `${name}/login`,
      async ({
        username,
        password,
      }) => api.post('login/', {
        username,
        password,
      }),
    );
  }

  return {
    login: login(),
  };
}

// Ugh, so regret using this code as example
const extraActions = createExtraActions();

function createExtraReducers() {
  function login() {
    const { pending, fulfilled, rejected } = extraActions.login;
    return {
      [pending]: (state) => {
        state.error = null;
      },
      [fulfilled]: (state, action) => {
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
      [rejected]: (state, action) => {
        state.error = action.error;
      },
    };
  }

  return {
    ...login(),
  };
}

const initialState = createInitialState();
const reducers = createReducers();
const extraReducers = createExtraReducers();
const slice = createSlice({
  name, initialState, reducers, extraReducers,
});

// exports
export const authActions = { ...slice.actions, ...extraActions };
export const authReducer = slice.reducer;
