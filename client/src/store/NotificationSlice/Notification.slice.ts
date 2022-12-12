import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationState } from 'types/store';

const initialState: NotificationState = {
  alert: ['Hello World'],
};

const NotificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addMsg: (state: NotificationState, action: PayloadAction<string>) => {
      state.alert.push(action.payload);
    },
    readMsg: (state: NotificationState, action: PayloadAction<string>) => {
      state.alert.push(action.payload);
    },
  },
});

export default NotificationSlice.reducer;
export const { addMsg } = NotificationSlice.actions;
