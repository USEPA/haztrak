import React from 'react';
import { cleanup, screen, renderWithProviders } from 'utils';
import '@testing-library/jest-dom';
import Home from './index';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const API_BASE_URL = process.env.REACT_APP_HT_API_URL;

export const handlers = [
  rest.get(`${API_BASE_URL}/api/user/profile`, (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        token: 'fake_token',
        user: 'testuser1',
        rcraAPIID: 'test_api_id',
        rcraAPIKey: 'test_api_key_to_be_eliminated',
        epaSites: ['VATESTRAN003', 'VATESTGEN001'],
        phoneNumber: undefined,
        loading: false,
        error: undefined,
      })
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

describe('Home', () => {
  test('renders', async () => {
    renderWithProviders(<Home />, {});
    expect(await screen.findByText('Hello testuser1!')).toBeInTheDocument();
  });
});
