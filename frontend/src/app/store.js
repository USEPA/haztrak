import { configureStore } from '@reduxjs/toolkit';
import { userReducers, login, getUser } from './user.slice';

const setupStore = (preloadedState) => {
  return configureStore({
    reducer: {
      user: userReducers,
    },
    preloadedState,
  });
};

const store = configureStore({
  reducer: {
    user: userReducers,
  },
});

export { getUser, login, store, setupStore };
