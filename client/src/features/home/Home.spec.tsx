import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { API_BASE_URL, handlers } from 'test-utils/mock/handlers';
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { Home } from './Home';

const USERNAME = 'testuser1';

const myAPIHandlers = [
  rest.get(`${API_BASE_URL}/api/rcra/profile/${USERNAME}`, (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        user: USERNAME,
        rcraAPIID: 'mockRcraAPIID',
        rcraUsername: undefined,
        epaSites: [],
        phoneNumber: undefined,
        apiUser: true,
      })
    );
  }),
];

const server = setupServer(...handlers, ...myAPIHandlers);

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
          user: { username: USERNAME, isLoading: false },
          token: 'fake_token',
          loading: false,
          error: undefined,
        },
      },
    });
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
  });
});
