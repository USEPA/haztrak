import {
  Action,
  combineReducers,
  configureStore,
  PreloadedState,
  ThunkAction,
} from '@reduxjs/toolkit';
import userReducers, { getUser, login } from './UserSlice';
import notificationReducers, { addMsg } from './NotificationSlice';

const rootReducer = combineReducers({
  user: userReducers,
  notification: notificationReducers,
});

// Primarily use this for test to simulate the Redux store
const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

// The central Redux store
const store = setupStore();

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export { store, getUser, login, setupStore, addMsg };
// Todo: see if I need to keep this
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
