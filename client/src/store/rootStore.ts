import { combineReducers, configureStore, PreloadedState } from '@reduxjs/toolkit';
import userReducers, { login } from './authSlice/auth.slice';
import { haztrakApi } from './haztrakApiSlice';
import notificationReducers from './notificationSlice/notification.slice';
import profileReducers from './profileSlice/profile.slice';
import errorReducers from './errorSlice/error.slice';

const rootReducer = combineReducers({
  auth: userReducers,
  notification: notificationReducers,
  profile: profileReducers,
  error: errorReducers,
  [haztrakApi.reducerPath]: haztrakApi.reducer,
});

/**
 * A utility function to initialize the store with preloaded state.
 * Often used for testing
 */
const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(haztrakApi.middleware),
    preloadedState,
  });
};

// The central Redux store
const rootStore = setupStore();

export type AppDispatch = typeof rootStore.dispatch;
/**
 * A TypeScript definition for our (Haztrak) RootState
 */
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export { rootStore, login, setupStore };
