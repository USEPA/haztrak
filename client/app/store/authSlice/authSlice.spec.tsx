import { setupServer } from 'msw/node';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { mockUserEndpoints } from '~/mocks/handlers';
import { RootState, rootStore } from '~/store';
import { selectCurrentUser } from '~/store/authSlice/auth.slice';
import { LoginRequest, userApi } from '~/store/userApi/userApi';

const server = setupServer(...mockUserEndpoints);

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('auth slice', () => {
  it('should set user and token on login fulfilled', async () => {
    const loginPayload: LoginRequest = { username: 'testuser', password: 'password' };
    const response = await rootStore.dispatch(userApi.endpoints.login.initiate(loginPayload));
    const state = rootStore.getState().auth;
    expect(state.token).toBe(response.data?.access);
    expect(state.user).toEqual({ ...response.data?.user });
  });
  it('should set user on getUser fulfilled', async () => {
    const response = await rootStore.dispatch(userApi.endpoints.getUser.initiate());
    const state = rootStore.getState().auth;
    expect(state.user).toEqual({ ...response.data });
  });

  it('should clear user and token on logout fulfilled', async () => {
    await rootStore.dispatch(userApi.endpoints.logout.initiate());
    const state = rootStore.getState().auth;
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });
  // ToDo: implement this test
  it('should clear user and token on getUser rejected with 401', async () => {
    expect(null).toBeNull();
  });

  it('should select the current user from state', () => {
    const state = { auth: { user: { username: 'testuser' }, token: 'token123' } };
    const currentUser = selectCurrentUser(state as RootState);
    expect(currentUser).toEqual({ username: 'testuser' });
  });
});
