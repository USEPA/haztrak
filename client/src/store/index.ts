import { addMsg, removeMsg } from 'store/notificationSlice';
import { useAppDispatch, useAppSelector } from './hooks';
import type { AppDispatch, RootState } from './store';
import { AppStore, getUser, login, setupStore, store } from './store';

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
