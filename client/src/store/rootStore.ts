import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducers from 'store/authSlice/auth.slice';
import { haztrakApi } from 'store/htApi.slice';
import errorReducers from './errorSlice/error.slice';
import notificationReducers from './notificationSlice/notification.slice';

const rootReducer = combineReducers({
  auth: authReducers,
  error: errorReducers,
  notifications: notificationReducers,
  [haztrakApi.reducerPath]: haztrakApi.reducer,
});

/**A utility function to initialize the store with preloaded state used for testing*/
const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(haztrakApi.middleware),
    preloadedState,
  });
};

/** The root store for the application*/
const rootStore = setupStore();
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppDispatch = typeof rootStore.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export { rootStore, setupStore };
