import '@testing-library/jest-dom';
import { Dashboard } from 'features/Dashboard/Dashboard';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { API_BASE_URL, handlers } from 'test-utils/mock/handlers';
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

const USERNAME = 'testuser1';

const myAPIHandlers = [
  http.get(`${API_BASE_URL}/api/user/rcrainfo-profile/${USERNAME}`, (info) => {
    return HttpResponse.json(
      {
        user: USERNAME,
        rcraAPIID: 'mockRcraAPIID',
        rcraUsername: undefined,
        epaSites: [],
        phoneNumber: undefined,
        apiUser: true,
      },
      { status: 200 }
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
    renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: {
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
