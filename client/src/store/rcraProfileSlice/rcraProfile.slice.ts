import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { ProfileEpaSite, RcraProfileState } from 'types/store';
import { RootState } from 'store/rootStore';

const initialState: RcraProfileState = {
  user: undefined,
  rcraAPIID: undefined,
  rcraUsername: undefined,
  epaSites: {},
  phoneNumber: undefined,
  loading: false,
  error: undefined,
};

interface RcraProfileResponse {
  user: undefined;
  rcraAPIID: undefined;
  rcraUsername: undefined;
  epaSites?: Array<ProfileEpaSite>;
  phoneNumber: undefined;
  loading: false;
  error: undefined;
}

export const getProfile = createAsyncThunk<RcraProfileState>(
  'rcraProfile/getProfile',
  async (arg, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const username = state.user.user;
    const response = await axios.get(
      `${process.env.REACT_APP_HT_API_URL}/api/trak/profile/${username}`
    );
    const { epaSites, ...rest } = response.data as RcraProfileResponse;
    let profile: RcraProfileState = { ...rest };
    profile.epaSites = epaSites?.reduce(
      (obj, site) => ({
        ...obj,
        [site.epaId]: site,
      }),
      {}
    );
    return profile;
  }
);

const rcraProfileSlice = createSlice({
  name: 'rcraProfile',
  initialState,
  reducers: {
    updateProfile: (state: RcraProfileState, action: PayloadAction<RcraProfileState>) => {
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
