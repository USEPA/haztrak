import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

const NotificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addMsg: (state: NotificationState, action: PayloadAction<string>) => {
      state.msg.push(action.payload);
    },
  },
});

export default NotificationSlice.reducer;
export const { addMsg } = NotificationSlice.actions;
