import { describe, expect, it } from 'vitest';
import { useAuth } from '~/hooks/useAuth/useAuth';
import { renderHookWithProviders } from '~/mocks';
import { createMockHaztrakUser } from '~/mocks/fixtures';

describe('useAuth', () => {
  it('returns user from useAppSelector', () => {
    const mockUser = createMockHaztrakUser();

    const { result } = renderHookWithProviders(() => useAuth(), {
      preloadedState: { auth: { user: mockUser } },
    });

    expect(result.current.user?.username).toEqual(mockUser.username);
  });
});
