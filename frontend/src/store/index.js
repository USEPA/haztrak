import { configureStore } from '@reduxjs/toolkit';

import { getUser, login, userReducers } from './user.slice';

export const store = configureStore({
  reducer: {
    user: userReducers,
  },
});

export { getUser, login };
