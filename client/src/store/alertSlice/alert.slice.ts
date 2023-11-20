import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { htApi } from 'services';
import { v4 as uuidv4 } from 'uuid';

/** Schema of a user's alerts stored in the Redux store */
export interface AlertSlice {
  alerts: Array<HaztrakAlert>;
}

/** Alert describes the payload used to interact with the Redux store 'notification' slice.*/
export interface HaztrakAlert {
  id: string;
  createdDate: string;
  read: boolean;
  message: string;
  type: AlertType;
  timeout: number;
  inProgress?: boolean;
}

export type AlertType = 'Warning' | 'Error' | 'Info' | 'Success';

const initialState: AlertSlice = {
  alerts: [],
};

/** Retrieves a user's RcraProfile from the server. */
export const launchExampleTask = createAsyncThunk<HaztrakAlert>(
  'alert/getExampleTask',
  async () => {
    const response = await htApi.get<{ taskId: string }>('/task/example');
    return createAlert({
      inProgress: false,
      message: `Background task launched. Task ID: ${response.data.taskId}`,
      type: 'Info',
      createdDate: new Date().toISOString(),
      read: false,
      timeout: 5000,
      id: response.data.taskId,
    });
  }
);

/** Creates a new alert with default values. */
const createAlert = (alert: Partial<HaztrakAlert>): HaztrakAlert => {
  return {
    inProgress: false,
    message: alert.message || 'No message provided',
    type: alert.type || 'Info',
    createdDate: new Date().toISOString(),
    read: false,
    timeout: alert.timeout || 5000,
    id: alert.id || uuidv4(),
  };
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    addAlert: (state: AlertSlice, action: PayloadAction<Partial<HaztrakAlert>>) => {
      const alert = createAlert(action.payload);
      state.alerts.push(alert);
      return state;
    },
    removeAlert: (state: AlertSlice, action: PayloadAction<HaztrakAlert>) => {
      const idToDelete = action.payload.id;
      for (let i = 0; i < state.alerts.length; i++) {
        if (state.alerts[i].id === idToDelete) {
          state.alerts.splice(i, 1);
        }
      }
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(launchExampleTask.pending, (state) => {
        return {
          ...state,
        };
      })
      .addCase(launchExampleTask.fulfilled, (state, action: PayloadAction<HaztrakAlert>) => {
        state.alerts.push(action.payload);
      })
      .addCase(launchExampleTask.rejected, (state) => {
        return state;
      });
  },
});

/** Selects the user's alerts from the Redux store. */
export const selectAllAlerts = (state: { alert: AlertSlice }) => state.alert.alerts;

export default alertSlice.reducer;
export const { addAlert, removeAlert } = alertSlice.actions;
