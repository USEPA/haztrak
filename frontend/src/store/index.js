import { configureStore } from '@reduxjs/toolkit';

import usersReducer from './user.slice';

export * from './user.slice';

export const store = configureStore({
  reducer: {
    user: usersReducer,
  },
});
