// test userSlice
import { UserState } from 'store/userSlice/user.slice';
import userReducers, { login } from 'store/userSlice';

jest.spyOn(Storage.prototype, 'setItem');
const initialState: UserState = {
  user: undefined,
  token: undefined,
  loading: false,
  error: undefined,
};

const userPayload: UserState = {
  user: 'testuser1',
  token: 'mockToken',
};

const errorMsg = 'rejected promise error message';
const rejectedPayload = {
  error: errorMsg,
};

const pendingLogin = { type: login.pending };
const fulfilledLogin = { type: login.fulfilled, payload: userPayload };
const rejectedLogin = { type: login.rejected, payload: rejectedPayload };
const pendingUserState = { ...initialState, loading: true };

describe('userSlice', () => {
  test('initial user state is not logged in', () => {
    expect(userReducers(initialState, pendingLogin)).toEqual({
      ...initialState,
      loading: true,
    });
  });
  test('fulfilled state sets user info to payload', () => {
    expect(userReducers(pendingUserState, fulfilledLogin)).toEqual({
      ...userPayload,
      loading: false,
      error: undefined,
    });
  });
  test('rejected state sets error', () => {
    expect(userReducers(pendingUserState, rejectedLogin)).toEqual({
      ...pendingUserState,
      error: errorMsg,
      loading: false,
    });
  });
});
