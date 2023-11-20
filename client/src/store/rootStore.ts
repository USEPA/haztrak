import { combineReducers, configureStore, PreloadedState } from '@reduxjs/toolkit';
import userReducers, { login } from './authSlice/auth.slice';
import errorReducers from './errorSlice/error.slice';
import { haztrakApi } from './haztrakApiSlice';
import profileReducers from './profileSlice/profile.slice';

const rootReducer = combineReducers({
  auth: userReducers,
  profile: profileReducers,
  error: errorReducers,
  [haztrakApi.reducerPath]: haztrakApi.reducer,
});

/**A utility function to initialize the store with preloaded state used for testing*/
const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(haztrakApi.middleware),
    preloadedState,
  });
};

/** The root store for the application*/
const rootStore = setupStore();

export type AppDispatch = typeof rootStore.dispatch;
/** A TypeScript definition for our (Haztrak) RootState*/
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export { rootStore, login, setupStore };
