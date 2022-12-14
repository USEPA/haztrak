import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import React from 'react';
import { renderWithProviders, screen } from 'test';
import { handlers } from 'test/mock/handlers';
import { MOCK_EPA_ID } from 'test/fixtures';
import SiteList from './index';
import { MOCK_SITE_ARRAY } from 'test/fixtures/mockHandler';

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
    const { debug } = renderWithProviders(<SiteList />);
    let numIds = await screen.findAllByRole('cell', { name: MOCK_EPA_ID });
    // Assert
    debug(undefined, Infinity);
    expect(numIds.length).toEqual(MOCK_SITE_ARRAY.length);
  });
});
