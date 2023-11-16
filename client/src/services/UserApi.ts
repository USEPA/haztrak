import { AxiosResponse } from 'axios';
import { HaztrakSite } from 'components/HaztrakSite';
import { htApi } from 'services/htApi';
import {
  HaztrakModulePermissions,
  RcrainfoProfile,
  RcrainfoProfileSite,
} from 'store/profileSlice/profile.slice';
import { HaztrakUser } from 'store/userSlice';

interface HaztrakOrgResponse {
  id: string;
  name: string;
  rcrainfoIntegrated: boolean;
}

interface HaztrakProfileResponse {
  user: string;
  sites: Array<{
    site: HaztrakSite;
    eManifest: HaztrakModulePermissions;
  }>;
  org?: HaztrakOrgResponse;
}

interface RcrainfoProfileResponse extends RcrainfoProfile<Array<RcrainfoProfileSite>> {}

export const UserApi = {
  /** Fetch the user's Haztrak profile from the Haztrak API*/
  getUserProfile: async (): Promise<AxiosResponse<HaztrakProfileResponse>> => {
    return await htApi.get('/profile');
  },

  /** Fetch Haztrak user from server*/
  getUser: async (): Promise<AxiosResponse<HaztrakUser>> => {
    return await htApi.get('/user');
  },

  /** Fetch Haztrak user from server*/
  updateUser: async (data: Partial<HaztrakUser>): Promise<AxiosResponse<HaztrakUser>> => {
    return await htApi.put('/user', data);
  },

  /** Fetch the user's RCRAInfo profile from the Haztrak API*/
  getRcrainfoProfile: async (username: string): Promise<AxiosResponse<RcrainfoProfileResponse>> => {
    return await htApi.get(`/rcra/profile/${username}`);
  },

  /** Update user's RCRAInfo Profile information such username, api ID & key*/
  updateRcrainfoProfile: async ({
    username,
    data,
  }: {
    username: string;
    data: any;
  }): Promise<AxiosResponse<any>> => {
    return await htApi.put(`/rcra/profile/${username}`, data);
  },

  /** Launch task to pull user's site/module permissions (RCRAInfo profile) from RCRAInfo*/
  syncRcrainfoProfile: async (): Promise<AxiosResponse<{ taskId: string }>> => {
    return await htApi.get(`rcra/profile/sync`);
  },
};
