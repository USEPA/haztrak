import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, renderWithProviders, screen } from '~/mocks';
import { TopNav } from './TopNav';

afterEach(() => {
  cleanup();
});

describe('TopNav', () => {
  test('renders when user is logged in', () => {
    const username = 'testuser1';
    renderWithProviders(<TopNav />, {
      preloadedState: {
        auth: {
          username: username,
          isAuthenticated: true,
          email: 'foo@gmail.com',
        },
      },
    });
    expect(screen.getByRole('button', { name: 'toggleSidebarNavigation' })).toBeInTheDocument();
  });
  test('returns nothing when user not logged in', () => {
    renderWithProviders(<TopNav />);
    expect(screen.queryByText(/Haztrak/i)).not.toBeInTheDocument();
  });
});
