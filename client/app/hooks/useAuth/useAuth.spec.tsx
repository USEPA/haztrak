import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { useAuth } from '~/hooks/useAuth/useAuth';
import { cleanup, renderHookWithProviders } from '~/mocks';
import { createMockHaztrakUser } from '~/mocks/fixtures';
import { setupServer } from 'msw/node';
import { mockUserEndpoints } from '~/mocks/handlers';

const server = setupServer(...mockUserEndpoints);
afterEach(() => cleanup());
beforeAll(() => server.listen());
afterAll(() => server.close());

describe('useAuth', () => {
  it('returns user from useAppSelector', () => {
    const mockUser = createMockHaztrakUser();

    const { result } = renderHookWithProviders(() => useAuth(), {
      preloadedState: { auth: { user: mockUser, token: null } },
    });

    expect(result.current.user?.username).toEqual(mockUser.username);
  });

  it('returns null when no user is present', () => {
    const { result } = renderHookWithProviders(() => useAuth(), {
      preloadedState: { auth: { user: null, token: null } },
    });

    expect(result.current.user).toBeNull();
  });

  it('returns login function and state', () => {
    const { result } = renderHookWithProviders(() => useAuth(), {
      preloadedState: { auth: { user: null, token: null } },
    });

    expect(result.current.login).toHaveProperty('login');
    expect(result.current.login).toHaveProperty('isLoading');
    expect(result.current.login).toHaveProperty('isSuccess');
    expect(result.current.login).toHaveProperty('isError');
  });
});
