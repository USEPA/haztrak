/**
 * A user's RcrainfoProfile slice encapsulates our logic related what actions and data a user
 * has access to for each EPA site ID.
 */
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HaztrakSite } from 'components/HaztrakSite';
import { RcraSite } from 'components/RcraSite';
import { RootState } from 'store';

/**The user's RCRAInfo account data stored in the Redux store*/
export interface ProfileSlice {
  user: string | undefined;
  rcrainfoProfile?: RcrainfoProfile<Record<string, RcrainfoProfileSite>>;
  sites?: Record<string, HaztrakProfileSite>;
  org?: HaztrakProfileOrg | null;
  loading?: boolean;
  error?: string;
}

export interface HaztrakProfileOrg {
  id: string;
  name: string;
  rcrainfoIntegrated: boolean;
}

/** A site a user has access to in RCRAInfo and their module permissions */
export interface RcrainfoProfileSite {
  epaSiteId: string;
  permissions: RcrainfoSitePermissions;
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
  user: string;
  rcraAPIID?: string;
  rcraUsername?: string;
  rcraAPIKey?: string;
  apiUser?: boolean;
  rcraSites?: T;
  phoneNumber?: string;
  isLoading?: boolean;
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

/**initial, state of a user's RcrainfoProfile.*/
const initialState: ProfileSlice = {
  user: undefined,
  rcrainfoProfile: undefined,
  sites: undefined,
  loading: false,
  error: undefined,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile: (state: ProfileSlice, action: PayloadAction<ProfileSlice>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

/** Retrieve a Haztrak site from the users Profile by the site's EPA ID number */
export const siteByEpaIdSelector = (
  epaId: string | undefined
): ((state: RootState) => RcraSite | undefined) =>
  createSelector(
    (state: { profile: ProfileSlice }) => state.profile.sites,
    (sites: Record<string, HaztrakProfileSite> | undefined) => {
      if (!sites) return undefined;

      const siteId = Object.keys(sites).find((key) => sites[key]?.handler.epaSiteId === epaId);
      if (!siteId) return undefined;

      const sitePermissions = sites[siteId];
      if (!sitePermissions) return undefined;

      return sitePermissions.handler;
    }
  );

/** Get all sites a user has access to their Haztrak Profile*/
export const selectHaztrakSites = createSelector(
  (state: { profile: ProfileSlice }) => state.profile.sites,
  (sites: Record<string, HaztrakProfileSite> | undefined) => {
    if (!sites) return undefined;

    return Object.values(sites).map((site) => site);
  }
);

/** Get all sites a user has access to their Haztrak Profile*/
export const selectHaztrakSiteEpaIds = createSelector(
  (state: { profile: ProfileSlice }) => state.profile.sites,
  (sites: Record<string, HaztrakProfileSite> | undefined) => {
    if (!sites) return [];
    return Object.values(sites).map((site) => site.handler.epaSiteId);
  }
);

/** select all RCRAInfo sites a user has access to from their RCRAInfo Profile if they're updated it*/
export const selectRcrainfoSites = createSelector(
  (state: { profile: ProfileSlice }) => state.profile.rcrainfoProfile?.rcraSites,
  (rcraSites: Record<string, RcrainfoProfileSite> | undefined) => {
    if (!rcraSites) return undefined;

    return Object.values(rcraSites).map((site) => site);
  }
);

/** Retrieve a user's RcrainfoProfile from the Redux store. */
export const selectRcraProfile = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.profile.rcrainfoProfile
);

/** Retrieve a user's HaztrakProfile from the Redux store. */
export const selectHaztrakProfile = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.profile
);

export default profileSlice.reducer;
export const { updateProfile } = profileSlice.actions;
