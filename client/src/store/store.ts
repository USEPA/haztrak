import { combineReducers, configureStore, PreloadedState } from '@reduxjs/toolkit';
import rcraProfileReducers from 'store/rcraProfileSlice';
import notificationReducers from './notificationSlice';
import userReducers, { getUser, login } from './userSlice';

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
const store = setupStore();

export type AppDispatch = typeof store.dispatch;
/**
 * A TypeScript definition for our (Haztrak) RootState
 */
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export { store, getUser, login, setupStore };
