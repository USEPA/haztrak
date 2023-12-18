import { authApi } from 'store/userSlice/user.slice';
// Haztrak API - RTK Query
import { haztrakApi } from './haztrakApiSlice';
import type { AppDispatch, AppStore, RootState } from './rootStore';

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

export const {
  useLoginMutation,
  useGetUserQuery,
  useGetProfileQuery,
  useGetRcrainfoProfileQuery,
  useUpdateUserMutation,
} = authApi;

// Authentication Slice
export {
  selectUser,
  selectUserName,
  updateUserProfile,
  setCredentials,
} from 'store/userSlice/user.slice';

// Profile Slice
export {
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
export type { HaztrakUser } from 'store/userSlice/user.slice';
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
