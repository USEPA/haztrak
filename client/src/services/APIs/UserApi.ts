import { AxiosResponse } from 'axios';
import { HaztrakSite } from 'components/HaztrakSite';
import { HaztrakModulePermissions, HaztrakUser, RcrainfoProfile, RcrainfoProfileSite } from 'store';
import { htApi } from './htApi';

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
    return await htApi.get('/user/profile');
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
    return await htApi.get(`/user/rcrainfo-profile/${username}`);
  },

  /** Update user's RCRAInfo Profile information such username, api ID & key*/
  updateRcrainfoProfile: async ({
    username,
    data,
  }: {
    username: string;
    data: any;
  }): Promise<AxiosResponse<any>> => {
    return await htApi.put(`/user/rcrainfo-profile/${username}`, data);
  },

  /** Launch task to pull user's site/module permissions (RCRAInfo profile) from RCRAInfo*/
  syncRcrainfoProfile: async (): Promise<AxiosResponse<{ taskId: string }>> => {
    return await htApi.get(`user/rcrainfo-profile/sync`);
  },
};
