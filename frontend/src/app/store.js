import { configureStore } from '@reduxjs/toolkit';
import { userReducers, login, getUser } from './user.slice';

// Primarily use this for test to simulate the store
const setupStore = (preloadedState) => {
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

export { getUser, login, store, setupStore };
