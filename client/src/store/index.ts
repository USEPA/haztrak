import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { addNotification, removeNotification } from './notificationSlice';
import type { AppDispatch, RootState } from './rootStore';
import { AppStore, login, rootStore, setupStore } from './rootStore';
import { siteByEpaIdSelector } from './profileSlice';
import {
  useGetTaskStatusQuery,
  useSearchRcrainfoSitesQuery,
  useSearchRcraSitesQuery,
  useGetDotIdNumbersQuery,
  useGetFedWasteCodesQuery,
  useGetStateWasteCodesQuery,
  haztrakApi,
} from 'store/haztrakApiSlice';

// TypeSafe redux hooks for using the store
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { rootStore, login, setupStore, addNotification, removeNotification };
export type { RootState, AppDispatch, AppStore };
export {
  haztrakApi,
  useGetTaskStatusQuery,
  useSearchRcrainfoSitesQuery,
  useSearchRcraSitesQuery,
  useGetStateWasteCodesQuery,
  useGetDotIdNumbersQuery,
  useGetFedWasteCodesQuery,
  siteByEpaIdSelector,
};
