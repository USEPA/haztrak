import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Schema of a user's alerts stored in the Redux store
 * Note, we don't store these in the back end database, this is just for looks.
 */
export interface NotificationState {
  notifications: Array<Notification>;
}

/**
 * Alert describes the payload used to interact with the Redux store 'notification' slice.
 */
export interface Notification {
  uniqueId: number;
  createdDate: string;
  read: boolean;
  message: string;
  alertType: 'Warning' | 'Error' | 'Info' | String;
  timeout: number;
}

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
