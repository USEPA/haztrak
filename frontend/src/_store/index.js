import {configureStore} from '@reduxjs/toolkit';

import {authReducer} from './auth.slice';
// import {usersReducer} from './users.slice';
import {mySliceReducer} from "./my.slice";

export * from './auth.slice';
// export * from './users.slice';
export * from './my.slice'

export const store = configureStore({
  reducer: {
    my: mySliceReducer,
    auth: authReducer,
    // users: usersReducer
  },
});
