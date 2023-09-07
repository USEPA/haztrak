import { combineReducers, configureStore, PreloadedState } from '@reduxjs/toolkit';
import notificationReducers from 'store/notificationSlice';
import rcraProfileReducers from 'store/rcraProfileSlice/index';
import { taskApi } from 'store/task.slice';
import userReducers, { login } from 'store/userSlice';
import { wasteCodeApi } from 'store/wasteCode.slice';

const rootReducer = combineReducers({
  user: userReducers,
  notification: notificationReducers,
  rcraProfile: rcraProfileReducers,
  [wasteCodeApi.reducerPath]: wasteCodeApi.reducer,
  [taskApi.reducerPath]: taskApi.reducer,
});

/**
 * A utility function to initialize the store with preloaded state.
 * Often used for testing
 */
const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(wasteCodeApi.middleware, taskApi.middleware),
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
