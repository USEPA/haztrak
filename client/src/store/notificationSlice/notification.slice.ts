import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

/**
 * Schema of a user's alerts stored in the Redux store
 * Note, we don't store these in the back end database, this is just for looks.
 */
export interface NotificationState {
  notifications: Array<HtNotification>;
}

/**
 * Alert describes the payload used to interact with the Redux store 'notification' slice.
 */
export interface HtNotification {
  uniqueId: string;
  createdDate: string;
  read: boolean;
  message: string;
  status: 'Warning' | 'Error' | 'Info' | 'Success';
  timeout: number;
  inProgress?: boolean;
}

const initialState: NotificationState = {
  notifications: [],
};

/**
 * Retrieves a user's RcraProfile from the server.
 */
export const getExampleTask = createAsyncThunk<HtNotification>(
  'notification/getExampleTask',
  async () => {
    const response = await axios.get(`${import.meta.env.VITE_HT_API_URL}/api/task/example`);
    const newNotification: HtNotification = {
      inProgress: false,
      message: `Background task launched. Task ID: ${response.data.task}`,
      status: 'Info',
      createdDate: new Date().toISOString(),
      read: false,
      timeout: 5000,
      uniqueId: response.data.task,
    };
    return newNotification;
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state: NotificationState, action: PayloadAction<HtNotification>) => {
      state.notifications.push(action.payload);
      return state;
    },
    removeNotification: (state: NotificationState, action: PayloadAction<HtNotification>) => {
      const idToDelete = action.payload.uniqueId;
      for (let i = 0; i < state.notifications.length; i++) {
        if (state.notifications[i].uniqueId === idToDelete) {
          state.notifications.splice(i, 1);
        }
      }
      return state;
    },
    updateNotification: (state: NotificationState, action: PayloadAction<HtNotification>) => {
      const idToUpdate = action.payload.uniqueId;
      for (let i = 0; i < state.notifications.length; i++) {
        if (state.notifications[i].uniqueId === idToUpdate) {
          state.notifications[i] = action.payload;
        }
      }
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getExampleTask.pending, (state) => {
        return {
          ...state,
        };
      })
      .addCase(getExampleTask.fulfilled, (state, action) => {
        state.notifications.push(action.payload);
      })
      .addCase(getExampleTask.rejected, (state) => {
        return state;
      });
  },
});

/**
 * Selects the user's alerts from the Redux store.
 * @param state
 */
export const selectNotifications = (state: { notification: NotificationState }) =>
  state.notification.notifications;

export default notificationSlice.reducer;
export const { addNotification, removeNotification, updateNotification } =
  notificationSlice.actions;
