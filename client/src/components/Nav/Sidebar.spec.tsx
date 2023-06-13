import '@testing-library/jest-dom';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { Sidebar } from 'components/Nav';

afterEach(() => {
  cleanup();
});

describe('Sidebar', () => {
  test('renders when use is logged in', () => {
    const username = 'testuser1';
    renderWithProviders(<Sidebar />, {
      preloadedState: {
        user: {
          user: { username: username, isLoading: false },
          token: 'fakeToken',
          loading: false,
        },
      },
    });
    expect(screen.getByText(username)).toBeInTheDocument();
  });
  test('returns nothing when user not logged in', () => {
    const userName = 'testuser1';
    renderWithProviders(<Sidebar />);
    expect(screen.queryByText(userName)).not.toBeInTheDocument();
  });
});
