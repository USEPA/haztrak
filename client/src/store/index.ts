import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './rootStore';
import { AppStore, rootStore, setupStore } from './rootStore';

// exports related to the rootStore
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export { rootStore, setupStore };
export type { RootState, AppDispatch, AppStore };

export {
  haztrakApi,
  useGetDotIdNumbersQuery,
  useGetFedWasteCodesQuery,
  useGetStateWasteCodesQuery,
  useGetTaskStatusQuery,
  useSearchRcrainfoSitesQuery,
  useSearchRcraSitesQuery,
} from 'store/haztrakApiSlice';

export {
  getHaztrakUser,
  login,
  selectUser,
  selectUserName,
  selectUserState,
  updateUserProfile,
} from './authSlice/auth.slice';

export {
  addNotification,
  removeNotification,
  selectNotifications,
  launchExampleTask,
} from './notificationSlice/notification.slice';

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

export type { HaztrakUser } from './authSlice/auth.slice';
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
