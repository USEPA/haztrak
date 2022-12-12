import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Alert, NotificationState } from 'types/store';

const initialState: NotificationState = {
  alert: [
    {
      uniqueId: Date.now(),
      createdDate: new Date().toISOString(),
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
    removeMsg: (state: NotificationState, action: PayloadAction<Alert>) => {
      const idToDelete = action.payload.uniqueId;
      for (let i = 0; i < state.alert.length; i++) {
        if (state.alert[i].uniqueId === idToDelete) {
          state.alert.splice(i, 1);
        }
      }
    },
  },
});

export default NotificationSlice.reducer;
export const { addMsg, removeMsg } = NotificationSlice.actions;
