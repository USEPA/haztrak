import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { htApi } from 'services';
import { TaskStatus } from 'store/haztrakApiSlice';

export interface LongRunningTask {
  status: 'PENDING' | 'STARTED' | 'SUCCESS' | 'FAILURE' | 'NOT FOUND';
  taskId: string;
  taskName: string;
  createdDate?: string;
}

interface TaskSlice {
  tasks: LongRunningTask[];
}

const initialState: TaskSlice = {
  tasks: [],
};

/**Retrieves a user's RcrainfoProfile, if it exists, from the server.*/
export const getLongRunningTask = createAsyncThunk(
  'task/getLongRunningTask',
  async (taskId: string, thunkAPI) => {
    const response = await htApi.get<TaskStatus>(`/api/task/${taskId}`);
    if (response.data.status == 'SUCCESS' || response.data.status == 'FAILURE') {
      return response.data;
    }
  }
);

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    addTask: (state: TaskSlice, action: PayloadAction<LongRunningTask>) => {
      state.tasks.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLongRunningTask.pending, (state, action) => {});
    builder.addCase(getLongRunningTask.fulfilled, (state, action) => {});
    builder.addCase(getLongRunningTask.rejected, (state, action) => {});
  },
});

export default taskSlice.reducer;
export const { addTask } = taskSlice.actions;
