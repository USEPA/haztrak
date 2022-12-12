import { createSlice, current } from '@reduxjs/toolkit';

export interface NotificationState {
  msg: Array<string>;
  alert?: Array<string>;
  warning?: Array<string>;
}

const initialState: NotificationState = {
  msg: ['Hello World'],
  alert: [],
  warning: [],
};

// export const addMsg = createAction<string, 'notification/addMsg'>(
//   'notification/addMsg'
// );
//
// /**
//  * Add a message to the notification center/state
//  * @return   {Object}      NotificationState
//  */
// const msgReducer = createReducer(initialState, (builder) => {
//   builder
//     .addCase(addMsg, (state, action: PayloadAction<string>) => {
//       // @ts-ignore
//       state.push('test push');
//       state.msg.push(action.payload);
//     })
//     .addDefaultCase((state, action) => {
//       state.msg.push('Default case');
//     });
// });

const NotificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addMsg: (state, action) => {
      console.log('before', current(state));
      state.msg.push(action.payload);
      console.log('after', current(state));
    },
  },
});

export default NotificationSlice.reducer;
export const { addMsg } = NotificationSlice.actions;
