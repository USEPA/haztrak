import '@testing-library/jest-dom';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { Sidebar } from 'components/Nav';

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

describe('Sidebar', () => {
  test('renders when use is logged in', () => {
    const userName = 'testuser1';
    renderWithProviders(<Sidebar />, {
      preloadedState: {
        user: {
          user: userName,
          token: 'fakeToken',
          loading: false,
        },
      },
    });
    expect(screen.getByText(userName)).toBeInTheDocument();
  });
  test('returns nothing when user not logged in', () => {
    const userName = 'testuser1';
    renderWithProviders(<Sidebar />);
    expect(screen.queryByText(userName)).not.toBeInTheDocument();
  });
});
