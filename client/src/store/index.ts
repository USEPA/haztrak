import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState, AppStore } from './rootStore';
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

// Notification Slice
export {
  addNotification,
  removeNotification,
  selectNotifications,
  launchExampleTask,
} from './notificationSlice/notification.slice';

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

export { addError, selectAllErrors } from './errorSlice/error.slice';

// Types
export type { HaztrakUser } from './authSlice/auth.slice';
export type { HaztrakError } from './errorSlice/error.slice';
export type { TaskStatus } from './haztrakApiSlice';
export type { HtNotification } from './notificationSlice/notification.slice';
export type {
  ProfileState,
  RcrainfoProfileState,
  HaztrakProfileSite,
  HaztrakSitePermissions,
  RcrainfoSitePermissions,
  HaztrakModulePermissions,
  RcrainfoProfile,
  RcrainfoProfileSite,
} from './profileSlice/profile.slice';
