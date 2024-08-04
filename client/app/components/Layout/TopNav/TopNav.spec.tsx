import { TopNav } from '~/components/Layout/TopNav/TopNav';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'app/mocks';
import { afterEach, describe, expect, test } from 'vitest';

afterEach(() => {
  cleanup();
});

describe('TopNav', () => {
  test('renders when user is logged in', () => {
    const username = 'testuser1';
    renderWithProviders(<TopNav />, {
      preloadedState: {
        auth: {
          user: { username: username, isLoading: false },
          token: 'fakeToken',
          loading: false,
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
