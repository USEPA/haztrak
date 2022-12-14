import { cleanup } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { renderWithProviders, screen } from 'test';
import { MOCK_EPA_ID, MOCK_HANDLER } from 'test/fixtures';
import SiteList from './index';

const API_BASE_URL = process.env.REACT_APP_HT_API_URL;

const SITE_ARRAY = [
  {
    name: MOCK_EPA_ID,
    handler: MOCK_HANDLER,
  },
  {
    name: 'test site name',
    handler: MOCK_HANDLER,
  },
];

export const handlers = [
  rest.get(`${API_BASE_URL}/api/trak/site`, (req, res, ctx) => {
    return res(ctx.delay(), ctx.status(200), ctx.json(SITE_ARRAY));
  }),
];

const server = setupServer(...handlers);

// Arrange
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup();
  jest.resetAllMocks();
});
afterAll(() => server.close()); // Disable API mocking after the tests are done.

describe('SiteList component', () => {
  test('renders', () => {
    renderWithProviders(<SiteList />, {});
  });
  test('fetches sites a user has access to', async () => {
    // Act
    renderWithProviders(<SiteList />);
    let numIds = await screen.findAllByRole('cell', { name: MOCK_EPA_ID });
    // Assert
    expect(numIds.length).toEqual(3);
  });
});
