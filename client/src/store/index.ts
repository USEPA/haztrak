import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, AppStore, RootState } from './rootStore';
import { rootStore, setupStore } from './rootStore';

// Root Store
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export { rootStore, setupStore };
export type { RootState, AppDispatch, AppStore };

// Haztrak API - RTK Query
export {
  haztrakApi,
  useGetDotIdNumbersQuery,
  useGetFedWasteCodesQuery,
  useGetStateWasteCodesQuery,
  useGetTaskStatusQuery,
  useSearchRcrainfoSitesQuery,
  useSearchRcraSitesQuery,
  useGetOrgSitesQuery,
  useGetMTNQuery,
  useGetUserHaztrakSitesQuery,
  useGetUserHaztrakSiteQuery,
} from 'store/haztrakApiSlice';

// Authentication Slice
export {
  getHaztrakUser,
  login,
  selectUser,
  selectUserName,
  selectUserState,
  updateUserProfile,
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
