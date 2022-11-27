import React from 'react';
import { cleanup, screen, renderWithProviders } from 'test';
import '@testing-library/jest-dom';
import Home from './index';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const API_BASE_URL = process.env.REACT_APP_HT_API_URL;

const username = 'testuser1';

export const handlers = [
  rest.get(`${API_BASE_URL}/api/user/profile`, (req, res, ctx) => {
    return res(
      ctx.delay(), // random 'realistic' server response time
      ctx.status(200),
      ctx.json({
        token: 'fake_token',
        user: username,
        epaSites: ['VATESTRAN003', 'VATESTGEN001'],
        phoneNumber: undefined,
        loading: false,
        error: undefined,
      })
    );
  }),
];

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
    renderWithProviders(<Home />, {});
    expect(await screen.findByText('Hello testuser1!')).toBeInTheDocument();
  });
});
