import type { AppDispatch, AppStore, RootState } from './rootStore';
// Haztrak API - RTK Query
import { haztrakApi } from './haztrakApiSlice';
import { authApi } from 'store/authSlice/auth.slice';

// Root Store
export { rootStore, setupStore, useAppDispatch, useAppSelector } from './rootStore';
export type { RootState, AppDispatch, AppStore };

export const {
  useLazyGetDotIdNumbersQuery,
  useGetFedWasteCodesQuery,
  useGetStateWasteCodesQuery,
  useGetTaskStatusQuery,
  useSearchRcrainfoSitesQuery,
  useSearchRcraSitesQuery,
  useGetOrgSitesQuery,
  useGetMTNQuery,
  useGetUserHaztrakSitesQuery,
  useGetUserHaztrakSiteQuery,
  useCreateManifestMutation,
  useSaveEManifestMutation,
  useSyncEManifestMutation,
  useSignEManifestMutation,
  useUpdateManifestMutation,
} = haztrakApi;

export const { useLoginMutation, useGetUserQuery } = authApi;

// Authentication Slice
export {
  selectUser,
  selectUserName,
  updateUserProfile,
  setCredentials,
} from './authSlice/auth.slice';

// Profile Slice
export {
  getHaztrakProfile,
  getRcraProfile,
  selectRcrainfoSites,
  selectRcraProfile,
  siteByEpaIdSelector,
  updateProfile,
  selectHaztrakSites,
  selectHaztrakSiteEpaIds,
  selectHaztrakProfile,
} from './profileSlice/profile.slice';

// Notification Slice
export {
  addTask,
  addAlert,
  removeTask,
  removeAlert,
  updateTask,
  selectTask,
  selectTaskCompletion,
  selectAllTasks,
  selectAllAlerts,
} from './notificationSlice/notification.slice';

// Error Slice
export { addError, selectAllErrors } from './errorSlice/error.slice';

// Types
export type { HaztrakUser } from './authSlice/auth.slice';
export type { HaztrakError } from './errorSlice/error.slice';
export type { TaskStatus } from './haztrakApiSlice';
export type { LongRunningTask, HaztrakAlert } from './notificationSlice/notification.slice';
export type {
  ProfileSlice,
  RcrainfoProfileState,
  HaztrakProfileSite,
  HaztrakSitePermissions,
  RcrainfoSitePermissions,
  HaztrakModulePermissions,
  RcrainfoProfile,
  RcrainfoProfileSite,
} from './profileSlice/profile.slice';
