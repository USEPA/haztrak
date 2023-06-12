import '@testing-library/jest-dom';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { TopNav } from 'components/Nav';

afterEach(() => {
  cleanup();
});

describe('TopNav', () => {
  test('renders when user is logged in', () => {
    const userName = 'testuser1';
    renderWithProviders(<TopNav />, {
      preloadedState: {
        user: {
          user: { username: userName },
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
