import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { UserApi } from 'services';
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
  'auth/login',
  async ({ username, password }: { username: string; password: string }) => {
    const response = await axios.post(`${import.meta.env.VITE_HT_API_URL}/api/user/login`, {
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

/** Fetch a Haztrak User's information and store in global state */
export const getHaztrakUser = createAsyncThunk('auth/getHaztrakUser', async (arg, thunkAPI) => {
  try {
    const { data } = await UserApi.getUser();
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

/**
 * User logout Redux reducer Function
 *
 * @description on logout, we want to strip all information
 * from browser storage and redux store's state
 * @param    {Object} user UserState
 * @return   {Object}      UserState
 */
function logout(user: UserState): object {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  return { ...initialState, user: undefined, token: undefined } as UserState;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout,
    updateUserProfile(state: UserState, action: any) {
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
export const selectUserName = (state: RootState): string | undefined => state.auth.user?.username;

/**
 * Select the current user
 */
export const selectUser = (state: RootState): HaztrakUser | undefined => state.auth.user;

/**
 * Select the current User State
 */
export const selectUserState = (state: RootState): UserState => state.auth;

export default authSlice.reducer;
export const { updateUserProfile } = authSlice.actions;
