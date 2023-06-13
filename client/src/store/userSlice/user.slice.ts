import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { htApi } from 'services';
import { RootState } from 'store/rootStore';

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
export interface UserState {
  user?: HaztrakUser;
  token?: string;
  loading?: boolean;
  error?: string;
}

const initialState: UserState = {
  // Retrieve the user's username and token from local storage. For convenience
  user: { username: JSON.parse(localStorage.getItem('user') || 'null') || null, isLoading: false },
  token: JSON.parse(localStorage.getItem('token') || 'null') || null,
  loading: false,
  error: undefined,
};

export const login = createAsyncThunk(
  'user/login',
  async ({ username, password }: { username: string; password: string }) => {
    const response = await axios.post(`${import.meta.env.VITE_HT_API_URL}/api/user/login/`, {
      username,
      password,
    });
    // return response.data as UserState;
    return {
      user: { username: response.data.user },
      token: response.data.token,
    } as UserState;
  }
);

export const getHaztrakUser = createAsyncThunk('user/getHaztrakUser', async (arg, thunkAPI) => {
  const response = await htApi.get(`${import.meta.env.VITE_HT_API_URL}/api/user`);
  if (response.status >= 200 && response.status < 300) {
    return response.data as HaztrakUser;
  } else {
    return thunkAPI.rejectWithValue(response.data);
  }
});

/**
 * User logout Redux reducer Function
 *
 * @description on logout, we want to strip all information
 * from browser storage and redux store's state
 * ToDo send logout request to server
 * @param    {Object} user UserState
 * @return   {Object}      UserState
 */
function logout(user: UserState) {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  return { ...initialState, user: undefined, token: undefined } as UserState;
}

/**
 * update the HaztrakUser state with the new user information
 */

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout,
    updateUserProfile(state: UserState, action: any) {
      console.log('updateUserProfile action', action);
      return {
        ...state,
        user: action.payload,
      };
    },
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
        localStorage.setItem('user', JSON.stringify(authResponse.user?.username));
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
      })
      .addCase(getHaztrakUser.pending, (state) => {
        return {
          ...state,
          error: undefined,
          loading: true,
        };
      })
      .addCase(getHaztrakUser.rejected, (state, action) => {
        return {
          ...state,
          error: `Error: ${action.payload}`,
          loading: true,
        };
      })
      .addCase(getHaztrakUser.fulfilled, (state, action) => {
        return {
          ...state,
          user: action.payload,
          error: undefined,
          loading: true,
        };
      });
  },
});

/**
 * Get the current user's username from the Redux store
 */
export const selectUserName = (state: RootState): string | undefined => state.user.user?.username;

/**
 * Select the current user
 */
export const selectUser = (state: RootState): HaztrakUser | undefined => state.user.user;

/**
 * Select the current User State
 */
export const selectUserState = (state: RootState): UserState => state.user;

export default userSlice.reducer;
export const { updateUserProfile } = userSlice.actions;
