/**
 * A user's RcraProfile slice encapsulates our logic related what actions and data a user
 * has access to for each EPA site ID.
 */
import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HaztrakSite } from 'components/HaztrakSite';
import { htApi } from 'services';
import { RootState } from 'store';

/**
 * The user's RCRAInfo account data stored in the Redux store
 */
export interface ProfileState {
  user: string | undefined;
  rcrainfoProfile?: RcrainfoProfileState;
  loading?: boolean;
  error?: string;
}

export interface RcrainfoProfileState {
  user?: string;
  rcraAPIID?: string;
  rcraUsername?: string;
  rcraAPIKey?: string;
  apiUser?: boolean;
  rcraSites?: Record<string, RcraProfileSite>;
  phoneNumber?: string;
  loading?: boolean;
  error?: string;
}

export interface RcrainfoSitePermissions {
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
  permissions: RcrainfoSitePermissions;
}

/**
 * initial, empty, state of a user's RcraProfile.
 */
const initialState: ProfileState = {
  user: undefined,
  rcrainfoProfile: undefined,
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
  sites: Array<{ site: HaztrakSite; eManifest: 'viewer' | 'editor' | 'signer' }>;
  loading: false;
  error: undefined;
}

interface HaztrakSiteAndPermissionsResponse {
  site: HaztrakSite;
  eManifest: 'viewer' | 'editor' | 'signer';
}

interface HaztrakProfileResponse {
  user: string;
  sites: Array<HaztrakSiteAndPermissionsResponse>;
}

/**
 * Retrieves a user's RcraProfile from the server.
 */
export const getHaztrakProfile = createAsyncThunk(
  'profile/getHaztrakProfile',
  async (arg, thunkAPI) => {
    const response = await htApi.get('/profile');
    const data = response.data as HaztrakProfileResponse;
    const sites = data.sites.reduce((obj, site) => {
      return {
        ...obj,
        [site.site.handler.epaSiteId]: {
          site: site.site.handler.epaSiteId,
          permissions: { eManifest: site.eManifest },
        },
      };
    }, {});
    return { sites };
  }
);

/**
 * Retrieves a user's RcraProfile from the server.
 */
export const getRcraProfile = createAsyncThunk<ProfileState>(
  'profile/getRcrainfoProfile',
  async (arg, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const username = state.user.user?.username;
    const response = await htApi.get(`/rcra/profile/${username}`);
    const { rcraSites, ...rest } = response.data as RcraProfileResponse;
    // Convert the array to an object which each key corresponding to the RcraSite's ID number
    let rcraProfile: ProfileState = { user: username };
    rcraProfile.rcrainfoProfile = { ...rest };
    rcraProfile.rcrainfoProfile.rcraSites = rcraSites?.reduce((obj, site) => {
      return {
        ...obj,
        [site.site.handler.epaSiteId]: { site: site.site, permissions: site.permissions },
      };
    }, {});
    return rcraProfile;
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile: (state: ProfileState, action: PayloadAction<ProfileState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getHaztrakProfile.pending, (state) => {
        return {
          ...state,
          loading: true,
          error: undefined,
        };
      })
      .addCase(getHaztrakProfile.fulfilled, (state, action) => {
        return {
          ...state,
          ...action.payload,
          loading: false,
          error: undefined,
        };
      })
      .addCase(getHaztrakProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = 'error';
        return state;
      })
      .addCase(getRcraProfile.pending, (state) => {
        return {
          ...state,
          loading: true,
          error: undefined,
        };
      })
      .addCase(getRcraProfile.fulfilled, (state, action) => {
        return {
          ...state,
          ...action.payload,
          loading: false,
          error: undefined,
        };
      })
      .addCase(getRcraProfile.rejected, (state, action) => {
        state.loading = false;
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
    // @ts-ignore
    (state: { profile: ProfileState }) => state.profile.rcrainfoProfile.rcraSites,
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

// @ts-ignore
export const selectRcraSites = (state: { profile: ProfileState }) =>
  // @ts-ignore
  state.profile.rcrainfoProfile.rcraSites;

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
  (state: RootState) => state.profile,
  (rcraProfile: ProfileState) => rcraProfile
);

export default profileSlice.reducer;
export const { updateProfile } = profileSlice.actions;
