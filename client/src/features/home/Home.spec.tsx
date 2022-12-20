import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test';
import { MOCK_USERNAME } from 'test/fixtures/mockHandler';
import { handlers } from 'test/mock/handlers';
import Home from './index';

const server = setupServer(...handlers);

beforeAll(() => server.listen()); // setup mock http server
afterEach(() => {
  server.resetHandlers();
  cleanup();
  jest.resetAllMocks();
});
afterAll(() => server.close()); // Disable API mocking after the tests are done.

describe('Home component', () => {
  test('renders', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText(/Hello/i)).toBeInTheDocument();
  });
  test('User information is retrieved', async () => {
    // This is mostly just a placeholder. As the Home component expands we ce build on this
    renderWithProviders(<Home />, {
      preloadedState: {
        user: {
          user: MOCK_USERNAME,
          token: 'fake_token',
          loading: false,
          error: undefined,
        },
      },
    });
    expect(await screen.findByText('Hello testuser1!')).toBeInTheDocument();
  });
});
