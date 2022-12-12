import type { AppDispatch, RootState } from './store';
import { AppStore, getUser, login, setupStore, store } from './store';
import { useAppDispatch, useAppSelector } from './hooks';
import { addMsg, removeMsg } from 'store/NotificationSlice';

export {
  store,
  getUser,
  login,
  setupStore,
  addMsg,
  removeMsg,
  useAppSelector,
  useAppDispatch,
};
export type { RootState, AppDispatch, AppStore };
