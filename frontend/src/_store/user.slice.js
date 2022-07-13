import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../_services';

const initialState = {
  user: 0,
  rcraAPIID: null,
  rcraAPIKey: null,
  epaSites: [],
  phoneNumber: null,
  loading: false,
};

export const getUser = createAsyncThunk('user/getUser', async () => {
  const profileResponse = await api.get('profile/', null);
  return (profileResponse);
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    [getUser.pending]: (state) => {
      state.loading = true;
    },
    // Todo figure out how to handle promises David, and be consistent dummy
    [getUser.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.user = payload.user;
      state.rcraAPIID = payload.rcraAPIID;
      state.rcraAPIKey = payload.rcraAPIKey;
      state.phoneNumber = payload.phoneNumber;
      state.epaSites = payload.epaSites;
      // return state = {...payload}
    },
    [getUser.rejected]: (state) => {
      state.loading = false;
    },
  },
});

// export const {getUser} = userSlice.actions
export const usersReducer = userSlice.reducer;
// function createExtraActions() {
//
//   return {
//     getAll: getAll()
//   };
//
//   function getAll() {
//     return createAsyncThunk(
//       `${name}/getAll`,
//       async () => 2
//     );
//   }
// }
//
// function createExtraReducers() {
//   return {
//     ...getAll()
//   };
//
//   function getAll() {
//     let {pending, fulfilled, rejected} = extraActions.getAll;
//     return {
//       [pending]: (state) => {
//         state.users = {loading: true};
//       },
//       [fulfilled]: (state, action) => {
//         state.users = action.payload;
//       },
//       [rejected]: (state, action) => {
//         state.users = {error: action.error};
//       }
//     };
//   }
// }
