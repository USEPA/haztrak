import { configureStore } from '@reduxjs/toolkit';
import { userReducers, login, getUser } from './user.slice';

export const store = configureStore({
  reducer: {
    user: userReducers,
  },
});

export { getUser, login };
