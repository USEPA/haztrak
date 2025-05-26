import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { useAuth } from '~/hooks/useAuth/useAuth';
import { cleanup, renderHookWithProviders } from '~/mocks';
import { createMockHaztrakUser } from '~/mocks/fixtures';
import { mockUserEndpoints } from '~/mocks/handlers';

const server = setupServer(...mockUserEndpoints);
afterEach(() => cleanup());
beforeAll(() => server.listen());
afterAll(() => server.close());

describe('useAuth', () => {
  it('unauthenticated by default', () => {
    const mockUser = createMockHaztrakUser();

    const { result } = renderHookWithProviders(() => useAuth(), {
      preloadedState: { auth: { isAuthenticated: false, username: null, email: null } },
    });

    expect(result.current.isAuthenticated).toBeFalsy();
  });

  it('returns login function and state', () => {
    const { result } = renderHookWithProviders(() => useAuth(), {
      preloadedState: { auth: { isAuthenticated: true, username: null, email: null } },
    });

    expect(result.current.login).toHaveProperty('login');
    expect(result.current.login).toHaveProperty('isLoading');
    expect(result.current.login).toHaveProperty('isSuccess');
    expect(result.current.login).toHaveProperty('isError');
  });
});
