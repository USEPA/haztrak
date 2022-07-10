import {configureStore} from '@reduxjs/toolkit';

import {authReducer} from './auth.slice';
import {usersReducer} from './user.slice';
import {mySliceReducer} from "./my.slice";

export * from './auth.slice';
export * from './user.slice';
export * from './my.slice'

export const store = configureStore({
  reducer: {
    my: mySliceReducer,
    auth: authReducer,
    user: usersReducer
  },
});
