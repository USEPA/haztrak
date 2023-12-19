import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import userReducers, { authApi } from 'store/userSlice/user.slice';
import errorReducers from './errorSlice/error.slice';
import { haztrakApi } from './haztrakApiSlice';
import notificationReducers from './notificationSlice/notification.slice';
import profileReducers from './profileSlice/profile.slice';

const rootReducer = combineReducers({
  auth: userReducers,
  profile: profileReducers,
  error: errorReducers,
  notifications: notificationReducers,
  [haztrakApi.reducerPath]: haztrakApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
});

/**A utility function to initialize the store with preloaded state used for testing*/
const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(haztrakApi.middleware, authApi.middleware),
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
