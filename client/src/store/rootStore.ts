import { combineReducers, configureStore, PreloadedState } from '@reduxjs/toolkit';
import { haztrakApi } from 'store/htApiSlice';
import notificationReducers from 'store/notificationSlice';
import profileReducers from 'store/profileSlice/index';
import userReducers, { login } from 'store/userSlice';

const rootReducer = combineReducers({
  user: userReducers,
  notification: notificationReducers,
  profile: profileReducers,
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
