// test userSlice
import { UserState } from 'types/store';
import userReducers, { getUser } from './user.slice';

jest.spyOn(Storage.prototype, 'setItem');

describe('User Slice tests', () => {
  const initialState: UserState = {
    user: undefined,
    token: undefined,
    epaSites: [],
    phoneNumber: '',
    loading: false,
    error: undefined,
  };

  const userPayload = {
    user: 'testuser1',
    rcraAPIID: 'asdfasdfasdf',
    rcraAPIKey: 'blah lbha',
    epaSites: ['VATESTGEN001'],
    phoneNumber: '2142555555',
  };

  const errorMsg = 'rejected promise error message';
  const rejectedPayload = {
    error: 'rejected promise error message',
  };

  const pendingGetUser = { type: getUser.pending };
  const fulfilledGetUser = { type: getUser.fulfilled, payload: userPayload };
  const rejectedGetUser = { type: getUser.rejected, payload: rejectedPayload };
  const pendingUserState = { ...initialState, loading: true };

  test('initial user state is not logged in', () => {
    expect(userReducers(initialState, pendingGetUser)).toEqual({
      ...initialState,
      loading: true,
    });
  });
  test('fulfilled state sets user info to payload', () => {
    expect(userReducers(pendingUserState, fulfilledGetUser)).toEqual({
      ...pendingUserState,
      loading: false,
      ...userPayload,
    });
  });
  test('rejected state sets error', () => {
    expect(userReducers(pendingUserState, rejectedGetUser)).toEqual({
      ...pendingUserState,
      loading: false,
      error: errorMsg,
    });
  });
});
