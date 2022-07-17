// test userSlice

import { getUser, userReducers } from './user.slice';

jest.spyOn(Storage.prototype, 'setItem');

describe('User Slice tests', () => {
  const initialState = {
    user: null,
    token: null,
    rcraAPIID: null,
    rcraAPIKey: null,
    epaSites: [],
    phoneNumber: null,
    loading: false,
    error: null,
  };

  const pendingGetUser = { type: getUser.pending };
  const fulfilledGetUser = { type: getUser.fulfilled };
  const rejectedGetUser = { type: getUser.rejected };

  test('initial user state is not logged in', () => {
    expect(userReducers(initialState, pendingGetUser)).toEqual({
      ...initialState,
      loading: true,
    });
  });
});
