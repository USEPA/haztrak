import { cleanup, renderWithProviders, screen } from 'app/mocks';
import { mockUserEndpoints } from 'app/mocks/handlers';
import { setupServer } from 'msw/node';
import React, { createElement } from 'react';
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { mockSiteEndpoints } from '~/mocks/handlers/mockSiteEndpoints';
import { Dashboard } from './Dashboard';

const USERNAME = 'testuser1';

const server = setupServer(...mockSiteEndpoints, ...mockUserEndpoints);

beforeAll(() => {
  vi.mock('recharts', async (importOriginal) => {
    const originalModule = (await importOriginal()) as Record<string, unknown>;
    return {
      ...originalModule,
      ResponsiveContainer: () => createElement('div'),
    };
  });
  server.listen();
}); // setup mock http server
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
          user: { username: USERNAME },
          token: 'fake_token',
        },
      },
    });
    expect(screen.queryAllByText(/status/i)).length.greaterThanOrEqual(1);
  });
});
