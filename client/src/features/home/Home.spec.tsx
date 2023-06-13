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
          user: { username: username, isLoading: false },
          token: 'fake_token',
          loading: false,
          error: undefined,
        },
      },
    });
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
  });
});
