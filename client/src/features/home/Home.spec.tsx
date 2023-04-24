import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { handlers } from 'test-utils/mock/handlers';
import { Home } from 'features/home';
import { vi } from 'vitest';

const server = setupServer(...handlers);
const username = 'testuser1';

beforeAll(() => server.listen()); // setup mock http server
afterEach(() => {
  server.resetHandlers();
  cleanup();
  vi.resetAllMocks();
});
afterAll(() => server.close()); // Disable API mocking after the tests are done.

describe('Home', () => {
  test('renders', () => {
    renderWithProviders(<Home />, {
      preloadedState: {
        user: {
          user: username,
          token: 'fake_token',
          loading: false,
          error: undefined,
        },
      },
    });
    expect(screen.getByText(/Hello/i)).toBeInTheDocument();
  });
  test('User information is retrieved', async () => {
    // This is mostly just a placeholder. As the Home component expands we ce build on this
    renderWithProviders(<Home />, {
      preloadedState: {
        user: {
          user: username,
          token: 'fake_token',
          loading: false,
          error: undefined,
        },
      },
    });
    expect(await screen.findByText('Hello testuser1!')).toBeInTheDocument();
  });
});
