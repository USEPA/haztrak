import { addMsg, removeMsg } from 'store/notificationSlice';
import { useAppDispatch, useAppSelector } from './hooks';
import type { AppDispatch, RootState } from 'store/rootStore';
import { AppStore, login, setupStore, rootStore } from 'store/rootStore';

export { rootStore, login, setupStore, addMsg, removeMsg, useAppSelector, useAppDispatch };
export type { RootState, AppDispatch, AppStore };
