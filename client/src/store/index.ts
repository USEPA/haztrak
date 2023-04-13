import { addNotification, removeNotification } from './notificationSlice';
import { useAppDispatch, useAppSelector } from './hooks';
import type { AppDispatch, RootState } from './rootStore';
import { AppStore, login, rootStore, setupStore } from './rootStore';

export {
  rootStore,
  login,
  setupStore,
  addNotification,
  removeNotification,
  useAppSelector,
  useAppDispatch,
};
export type { RootState, AppDispatch, AppStore };
