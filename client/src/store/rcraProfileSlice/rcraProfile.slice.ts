import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import htApi from 'services';
import { RcraProfileState } from 'types/store';

const initialState: RcraProfileState = {
  user: undefined,
  rcraAPIID: undefined,
  rcraUsername: undefined,
  epaSites: [],
  // sites: [],
  phoneNumber: undefined,
  loading: false,
  error: undefined,
};

export const getProfile = createAsyncThunk(
  'rcraProfile/getProfile',
  async (arg, { getState }) => {
    const state = getState();
    // @ts-ignore
    const username = state.user.user;
    const response = await htApi.get(`trak/profile/${username}`);
    return response.data as RcraProfileState;
  }
);

const rcraProfileSlice = createSlice({
  name: 'rcraProfile',
  initialState,
  reducers: {
    updateProfile: (
      state: RcraProfileState,
      action: PayloadAction<RcraProfileState>
    ) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        return {
          ...state,
          loading: true,
          error: undefined,
        };
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        return {
          ...state,
          ...action.payload,
          loading: false,
          error: undefined,
        };
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        // Todo: remove ts-ignore
        // @ts-ignore
        state.error = action.payload.error;
        return state;
      });
  },
});

export default rcraProfileSlice.reducer;
export const { updateProfile } = rcraProfileSlice.actions;
