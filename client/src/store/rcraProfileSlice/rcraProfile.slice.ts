import { createSlice } from '@reduxjs/toolkit';
import { RcraProfileState } from 'types/store';

const initialState: RcraProfileState = {
  user: undefined,
  rcraAPIID: undefined,
  rcraUsername: undefined,
  epaSites: [],
  phoneNumber: undefined,
  loading: false,
  error: undefined,
};

const rcraProfileSlice = createSlice({
  name: 'rcraProfile',
  initialState,
  reducers: {},
});

export default rcraProfileSlice.reducer;
