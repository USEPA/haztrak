import { addMsg, removeMsg } from './notificationSlice';
import { useAppDispatch, useAppSelector } from './hooks';
import type { AppDispatch, RootState } from './rootStore';
import { AppStore, login, rootStore, setupStore } from './rootStore';

export { rootStore, login, setupStore, addMsg, removeMsg, useAppSelector, useAppDispatch };
export type { RootState, AppDispatch, AppStore };
