import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Alert, NotificationState } from 'types/store';

const initialState: NotificationState = {
  alert: [
    {
      read: false,
      alertType: 'Info',
      message: 'Welcome to Haztrak',
      timeout: 5000,
    },
  ],
};

const NotificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addMsg: (state: NotificationState, action: PayloadAction<Alert>) => {
      state.alert.push(action.payload);
    },
    readMsg: (state: NotificationState, action: PayloadAction<Alert>) => {
      state.alert.push(action.payload);
    },
  },
});

export default NotificationSlice.reducer;
export const { addMsg } = NotificationSlice.actions;
