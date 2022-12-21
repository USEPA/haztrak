import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Alert, NotificationState } from 'types/store';

const initialState: NotificationState = {
  alert: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addMsg: (state: NotificationState, action: PayloadAction<Alert>) => {
      state.alert.push(action.payload);
      return state;
    },
    readMsg: (state: NotificationState, action: PayloadAction<Alert>) => {
      state.alert.push(action.payload);
      return state;
    },
    removeMsg: (state: NotificationState, action: PayloadAction<Alert>) => {
      const idToDelete = action.payload.uniqueId;
      for (let i = 0; i < state.alert.length; i++) {
        if (state.alert[i].uniqueId === idToDelete) {
          state.alert.splice(i, 1);
        }
      }
      return state;
    },
  },
});

export default notificationSlice.reducer;
export const { addMsg, removeMsg } = notificationSlice.actions;
