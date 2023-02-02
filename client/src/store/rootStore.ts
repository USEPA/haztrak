import { combineReducers, configureStore, PreloadedState } from '@reduxjs/toolkit';
import rcraProfileReducers from 'store/rcraProfileSlice/index';
import notificationReducers from 'store/notificationSlice';
import userReducers, { login } from 'store/userSlice';

const rootReducer = combineReducers({
  user: userReducers,
  notification: notificationReducers,
  rcraProfile: rcraProfileReducers,
});

/**
 * A utility function to initialize the store with preloaded state.
 * Often used for testing
 */
const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
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
