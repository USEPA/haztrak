import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LongRunningTask {
  status: 'PENDING' | 'STARTED' | 'SUCCESS' | 'FAILURE' | 'NOT FOUND';
  taskId: string;
  taskName: string;
  createdDate?: string;
  complete?: boolean;
}

interface NotificationSlice {
  tasks: LongRunningTask[];
}

const initialState: NotificationSlice = {
  tasks: [],
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
  },
});

export const selectAllTasks = (state: { notifications: NotificationSlice }) =>
  state.notifications.tasks;

export default taskSlice.reducer;
export const { addTask, updateTask, removeTask } = taskSlice.actions;
