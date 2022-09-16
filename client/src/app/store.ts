import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { userReducers, login, getUser } from './user.slice';

// Primarily use this for test to simulate the Redux store
const setupStore = (preloadedState: RootState) => {
  return configureStore({
    reducer: {
      user: userReducers,
    },
    preloadedState,
  });
};

// The central Redux store
const store = configureStore({
  reducer: {
    user: userReducers,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export { store, getUser, login, setupStore };
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
