import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification, NotificationState } from 'types/store';

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addMsg: (state: NotificationState, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
      return state;
    },
    readMsg: (state: NotificationState, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
      return state;
    },
    removeMsg: (state: NotificationState, action: PayloadAction<Notification>) => {
      const idToDelete = action.payload.uniqueId;
      for (let i = 0; i < state.notifications.length; i++) {
        if (state.notifications[i].uniqueId === idToDelete) {
          state.notifications.splice(i, 1);
        }
      }
      return state;
    },
  },
});

export default notificationSlice.reducer;
export const { addMsg, removeMsg } = notificationSlice.actions;
