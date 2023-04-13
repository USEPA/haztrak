/**
 * A user's RcraProfile slice encapsulates our logic related what actions and data a user
 * has access to for each EPA site ID.
 */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from 'store';

/**
 * The user's RCRAInfo account data stored in the Redux store
 */
export interface RcraProfileState {
  /**
   * User's haztrak username
   */
  user: string | undefined;
  /**
   * The user's API ID for the EPA RCRAInfo/e-Manifest system
   */
  rcraAPIID?: string;
  /**
   * The user's RCRAInfo system username
   */
  rcraUsername?: string;
  /**
   * The user's API key for the EPA RCRAInfo/e-Manifest system.
   * Should never be sent to client, only received from.
   */
  rcraAPIKey?: string;
  /**
   * Array of EPA sites a user has access to in RCRAInfo stored in key-value pairs
   * where the keys are the site's EPA ID number
   */
  rcraSites?: Record<string, RcraSitePermissions>;
  phoneNumber?: string;
  loading?: boolean;
  error?: string;
  /**
   * Indicates whether the user is authorized
   */
  apiUser?: boolean;
}

/**
 * The user's site permissions for an EPA site in RCRAInfo, including each the user's
 * permission for each RCRAInfo module
 */
export interface RcraSitePermissions {
  epaId: string;
  permissions: {
    /**
     * Whether the user has 'Site Manager' level access.
     * If true, all other modules should be equal to 'Certifier'
     */
    siteManagement: boolean;
    annualReport: string;
    biennialReport: string;
    eManifest: string;
    /**
     * The RCRAInfo Waste Import Export Tracking System (WIETS)
     */
    WIETS: string;
    myRCRAid: string;
  };
}

/**
 * initial, empty, state of a user's RcraProfile.
 */
const initialState: RcraProfileState = {
  user: undefined,
  rcraAPIID: undefined,
  rcraUsername: undefined,
  rcraSites: {},
  phoneNumber: undefined,
  apiUser: false,
  loading: false,
  error: undefined,
};

/**
 * Interface of the haztrak server response,
 *
 * Notice we convert the array of site objects to an object where each key is ID number of the
 * site. This avoids looping through the array every time we need site information.
 */
interface RcraProfileResponse {
  user: undefined;
  rcraAPIID: undefined;
  rcraUsername: undefined;
  rcraSites?: Array<RcraSitePermissions>;
  phoneNumber: undefined;
  apiUser: boolean;
  loading: false;
  error: undefined;
}

/**
 * Retrieves a user's RcraProfile from the server.
 */
export const getProfile = createAsyncThunk<RcraProfileState>(
  'rcraProfile/getProfile',
  async (arg, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const username = state.user.user;
    const response = await axios.get(
      `${process.env.REACT_APP_HT_API_URL}/api/site/profile/${username}`
    );
    const { rcraSites, ...rest } = response.data as RcraProfileResponse;
    // Convert the array of RcraSite permissions we get from our backend
    // to an object which each key corresponding to the RcraSite's ID number
    let profile: RcraProfileState = { ...rest };
    profile.rcraSites = rcraSites?.reduce(
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
