import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  on: false,
  position: 0,
};

const mySlice = createSlice({
  name: 'mySlice',
  initialState,
  reducers: {
    toggleOn(state) {
      state.on = !state.on;
    },
    moveForward(state, action) {
      if (state.on) {
        state.position += action.payload;
      }
    },
    moveBack(state, action) {
      if (state.on) {
        state.position -= action.payload;
      }
    },
  },
});

export const { toggleOn, moveForward, moveBack } = mySlice.actions;
export const mySliceReducer = mySlice.reducer;
