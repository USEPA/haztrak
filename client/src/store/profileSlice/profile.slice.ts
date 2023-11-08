/**
 * A user's RcraProfile slice encapsulates our logic related what actions and data a user
 * has access to for each EPA site ID.
 */
import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HaztrakSite } from 'components/HaztrakSite';
import { htApi } from 'services';
import { HtApi } from 'services/htApi';
import { RootState } from 'store';

/**The user's RCRAInfo account data stored in the Redux store*/
export interface ProfileState {
  user: string | undefined;
  rcrainfoProfile?: RcrainfoProfile<Record<string, RcrainfoProfileSite>>;
  sites?: Record<string, HaztrakProfileSite>;
  loading?: boolean;
  error?: string;
}

export interface HaztrakProfileSite extends HaztrakSite {
  permissions: HaztrakSitePermissions;
}

export type HaztrakModulePermissions = 'viewer' | 'editor' | 'signer';

export interface HaztrakSitePermissions {
  eManifest: HaztrakModulePermissions;
}

export interface RcrainfoProfileState
  extends RcrainfoProfile<Record<string, RcrainfoProfileSite>> {}

export interface RcrainfoProfile<T> {
  user?: string;
  rcraAPIID?: string;
  rcraUsername?: string;
  rcraAPIKey?: string;
  apiUser?: boolean;
  rcraSites?: T;
  phoneNumber?: string;
  loading?: boolean;
  error?: string;
}

export interface RcrainfoSitePermissions {
  siteManagement: boolean;
  annualReport: string;
  biennialReport: string;
  eManifest: string;
  WIETS: string;
  myRCRAid: string;
}

/**
 * The user's site permissions for an EPA site in RCRAInfo, including each the user's
 * permission for each RCRAInfo module
 */
export interface RcrainfoProfileSite {
  epaSiteId: string;
  permissions: RcrainfoSitePermissions;
}

/**initial, state of a user's RcraProfile.*/
const initialState: ProfileState = {
  user: undefined,
  rcrainfoProfile: undefined,
  sites: undefined,
  loading: false,
  error: undefined,
};

/**Retrieves a user's profile from the server.*/
export const getHaztrakProfile = createAsyncThunk('profile/getHaztrakProfile', async () => {
  const data = await HtApi.getUserProfile();
  const sites = data.sites.reduce((obj, site) => {
    return {
      ...obj,
      [site.site.handler.epaSiteId]: {
        ...site.site,
        permissions: { eManifest: site.eManifest },
      },
    };
  }, {});
  return { sites };
});

/**Retrieves a user's RcrainfoProfile, if it exists, from the server.*/
export const getRcraProfile = createAsyncThunk<ProfileState>(
  'profile/getRcrainfoProfile',
  async (arg, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const username = state.user.user?.username;
    const response = await htApi.get(`/rcra/profile/${username}`);
    const { rcraSites, ...rest } = response.data as RcrainfoProfile<Array<RcrainfoProfileSite>>;
    // Convert the array to an object which each key corresponding to the RcraSite's ID number
    let rcraProfile: ProfileState = { user: username };
    rcraProfile.rcrainfoProfile = { ...rest };
    rcraProfile.rcrainfoProfile.rcraSites = rcraSites?.reduce((obj, site) => {
      return {
        ...obj,
        [site.epaSiteId]: { epaSiteId: site.epaSiteId, permissions: site.permissions },
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
 * Retrieve a site that the user has access to in their Haztrak Profile by the site's EPA ID number
 * @param epaId
 */
export const siteByEpaIdSelector = (epaId: string | undefined) =>
  createSelector(
    // @ts-ignore
    (state: { profile: ProfileState }) => state.profile.sites,
    (sites: Record<string, HaztrakProfileSite> | undefined) => {
      if (!sites) return undefined;

      const siteId = Object.keys(sites).find((key) => sites[key]?.handler.epaSiteId === epaId);
      if (!siteId) return undefined;

      const sitePermissions = sites[siteId];
      if (!sitePermissions) return undefined;

      return sitePermissions.handler;
    }
  );

export const selectHaztrakSites = (state: { profile: ProfileState }) => state.profile.sites;

// @ts-ignore
export const selectRcraSites = (state: { profile: ProfileState }) =>
  // @ts-ignore
  state.profile.rcrainfoProfile.rcraSites;

export const userHaztrakSitesSelector = createSelector(
  selectHaztrakSites,
  (sites: Record<string, HaztrakProfileSite> | undefined) => {
    if (!sites) return undefined;

    return Object.values(sites).map((site) => site);
  }
);

/**
 * Retrieve a RcraSite that the user has access to in their RcraProfile by the site's EPA ID number
 * @param epaId
 */
export const userRcraSitesSelector = createSelector(
  selectRcraSites,
  (rcraSites: Record<string, RcrainfoProfileSite> | undefined) => {
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
