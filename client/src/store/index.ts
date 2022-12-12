import type { AppDispatch, RootState } from './store';
import { addMsg, AppStore, getUser, login, setupStore, store } from './store';
import { useAppDispatch, useAppSelector } from './hooks';

export { store, getUser, login, setupStore, addMsg, useAppSelector, useAppDispatch };
export type { RootState, AppDispatch, AppStore };
