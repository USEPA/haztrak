import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlertSlice } from 'store/alertSlice/alert.slice';

export interface HaztrakError {
  id: string;
  message: string;
  status: number;
}

interface ErrorSlice {
  errors: HaztrakError[];
}

const initialState: ErrorSlice = {
  errors: [],
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    /** Add an error to the Redux store */
    addError: (state: ErrorSlice, action: PayloadAction<HaztrakError>) => {
      state.errors.push(action.payload);
    },
  },
});

/** Get all errors from Redux store */
export const selectAllErrors = (state: { error: ErrorSlice }): HaztrakError[] => state.error.errors;

export default errorSlice.reducer;
export const { addError } = errorSlice.actions;
