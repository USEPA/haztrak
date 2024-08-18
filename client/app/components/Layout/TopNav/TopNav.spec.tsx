import { cleanup, renderWithProviders, screen } from '~/mocks';
import React from 'react';
import { afterEach, describe, expect, test } from 'vitest';
import { TopNav } from '~/components/Layout/TopNav/TopNav';

afterEach(() => {
  cleanup();
});

describe('TopNav', () => {
  test('renders when user is logged in', () => {
    const username = 'testuser1';
    renderWithProviders(<TopNav />, {
      preloadedState: {
        auth: {
          user: { username: username },
          token: 'fakeToken',
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
