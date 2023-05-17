/**
 * A user's RcraProfile slice encapsulates our logic related what actions and data a user
 * has access to for each EPA site ID.
 */
import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { HaztrakSite } from 'components/HaztrakSite';
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
   * EPA sites a user has access to in RCRAInfo stored in key-value pairs
   * where the keys are the site's EPA ID number
   */
  rcraSites?: Record<string, RcraProfileSite>;
  phoneNumber?: string;
  loading?: boolean;
  error?: string;
  apiUser?: boolean; // Indicates whether the user is authorized ti utilize the RCRAInfo API
}

export interface RcraSitePermissions {
  siteManagement: boolean; // Whether the user has 'Site Manager' level access in RCRAInfo.
  annualReport: string;
  biennialReport: string;
  eManifest: string;
  WIETS: string; // The RCRAInfo Waste Import Export Tracking System (WIETS) module
  myRCRAid: string;
}

/**
 * The user's site permissions for an EPA site in RCRAInfo, including each the user's
 * permission for each RCRAInfo module
 */
export interface RcraProfileSite {
  site: HaztrakSite;
  permissions: RcraSitePermissions;
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
  rcraSites?: Array<RcraProfileSite>;
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
      `${import.meta.env.VITE_HT_API_URL}/api/site/profile/${username}`
    );
    const { rcraSites, ...rest } = response.data as RcraProfileResponse;
    // Convert the array of RcraSite permissions we get from our backend
    // to an object which each key corresponding to the RcraSite's ID number
    let profile: RcraProfileState = { ...rest };
    profile.rcraSites = rcraSites?.reduce((obj, site) => {
      return {
        ...obj,
        [site.site.handler.epaSiteId]: { site: site.site, permissions: site.permissions },
      };
    }, {});
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

/**
 * Retrieve a RcraSite that the user has access to in their RcraProfile by the site's EPA ID number
 * @param epaId
 */
export const siteByEpaIdSelector = (epaId: string | undefined) =>
  createSelector(
    (state: { rcraProfile: RcraProfileState }) => state.rcraProfile.rcraSites,
    (rcraSites: Record<string, RcraProfileSite> | undefined) => {
      if (!rcraSites) return undefined;

      const siteId = Object.keys(rcraSites).find(
        (key) => rcraSites[key]?.site?.handler.epaSiteId === epaId
      );
      if (!siteId) return undefined;

      const sitePermissions = rcraSites[siteId];
      if (!sitePermissions?.site) return undefined;

      return sitePermissions.site.handler;
    }
  );

export const selectRcraSites = (state: { rcraProfile: RcraProfileState }) =>
  state.rcraProfile.rcraSites;

/**
 * Retrieve a RcraSite that the user has access to in their RcraProfile by the site's EPA ID number
 * @param epaId
 */
export const userRcraSitesSelector = createSelector(
  selectRcraSites,
  (rcraSites: Record<string, RcraProfileSite> | undefined) => {
    if (!rcraSites) return undefined;

    return Object.values(rcraSites).map((site) => site);
  }
);

/**
 * Retrieve a user's RcraProfile from the Redux store
 */
export const selectRcraProfile = createSelector(
  (state: RootState) => state.rcraProfile,
  (rcraProfile: RcraProfileState) => rcraProfile
);

export default rcraProfileSlice.reducer;
export const { updateProfile } = rcraProfileSlice.actions;
