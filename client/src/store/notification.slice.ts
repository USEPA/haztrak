import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { RootState } from 'store/rootStore';
import { v4 as uuidv4 } from 'uuid';

export interface LongRunningTask {
  status: 'PENDING' | 'STARTED' | 'SUCCESS' | 'FAILURE' | 'NOT FOUND';
  taskId: string;
  taskName: string;
  createdDate?: string;
  complete?: boolean;
}

export interface HaztrakAlert {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  autoClose: number | false | undefined;
  createdDate?: string;
  read: boolean;
}

interface NotificationSlice {
  tasks: LongRunningTask[];
  alerts: HaztrakAlert[];
}

const initialState: NotificationSlice = {
  tasks: [],
  alerts: [],
};

/** Creates a new alert with default values. */
const createAlert = (alert: Partial<HaztrakAlert>): HaztrakAlert => {
  return {
    id: alert.id || uuidv4(),
    message: alert.message || "We're sorry, there was a problem. Please try again later.",
    type: alert.type || 'error',
    autoClose: alert.autoClose || 3000,
    createdDate: new Date().toISOString(),
    read: alert.read || false,
  };
};

const taskSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addTask: (state: NotificationSlice, action: PayloadAction<LongRunningTask>) => {
      state.tasks.push(action.payload);
      return state;
    },
    removeTask: (state: NotificationSlice, action: PayloadAction<{ taskId: string }>) => {
      state.tasks.filter((task) => task.taskId !== action.payload.taskId);
      return state;
    },
    updateTask: (state: NotificationSlice, action: PayloadAction<Partial<LongRunningTask>>) => {
      const taskIndex = state.tasks.findIndex((task) => task.taskId === action.payload.taskId);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...action.payload };
      }
      return state;
    },
    addAlert: (state: NotificationSlice, action: PayloadAction<Partial<HaztrakAlert>>) => {
      const newAlert = createAlert(action.payload);
      toast(newAlert.message, {
        ...newAlert,
      });
      state.alerts.push(newAlert);
      return state;
    },
    removeAlert: (state: NotificationSlice, action: PayloadAction<{ id: string }>) => {
      toast.dismiss(action.payload.id);
      state.tasks.filter((task) => task.taskId !== action.payload.id);
      return state;
    },
  },
});

/** Selects the notification slice from the store. */
const selectSelf = (state: RootState): NotificationSlice => state.notifications;

/** Selects all long-running tasks from the store. */
export const selectAllTasks = createSelector(selectSelf, (state: NotificationSlice) => state.tasks);

/** Selects a specific task from the store by ID. */
export const selectTask = (taskId: string | undefined) =>
  createSelector([selectAllTasks], (tasks) => tasks.find((task) => task.taskId === taskId));

/** Selects a specific task from the store by ID. */
export const selectTaskCompletion = (taskId: string | undefined) =>
  createSelector([selectTask(taskId)], (task) => task?.complete || false);

/** Selects all alerts from the store. */
export const selectAllAlerts = createSelector(
  selectSelf,
  (state: NotificationSlice) => state.alerts
);

export default taskSlice.reducer;
export const { addTask, updateTask, removeTask, addAlert, removeAlert } = taskSlice.actions;
