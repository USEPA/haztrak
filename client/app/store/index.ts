// Haztrak API - RTK Query
import { haztrakApi } from '~/store/htApi.slice';
import { userApi } from '~/store/userApi/userApi';
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
  useGetManifestQuery,
  useGetRcrainfoSiteQuery,
  useGetOrgsQuery,
  useGetOrgQuery,
} = haztrakApi;

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetUserQuery,
  useGetProfileQuery,
  useGetRcrainfoProfileQuery,
  useUpdateUserMutation,
  useUpdateRcrainfoProfileMutation,
  useSyncRcrainfoProfileMutation,
} = userApi;

// Authentication Slice
export { selectCurrentUser } from '~/store/authSlice/auth.slice';
export type { HaztrakUser } from '~/store/authSlice/auth.slice';

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
export type { HaztrakError } from './errorSlice/error.slice';
export type { TaskStatus } from '~/store/htApi.slice';
export type { LongRunningTask, HaztrakAlert } from './notificationSlice/notification.slice';
export type {
  ProfileSlice,
  RcrainfoProfileState,
  HaztrakProfileSite,
  HaztrakSitePermissions,
  RcrainfoSitePermissions,
  HaztrakModulePermissions,
  Organization,
  RcrainfoProfile,
  RcrainfoProfileSite,
} from './userApi/userApi';
