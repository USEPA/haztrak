import { SiteList } from './SiteList';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { createMockHandler, createMockRcrainfoSite } from 'test-utils/fixtures/mockHandler';
import { API_BASE_URL } from 'test-utils/mock/handlers';
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

const mockHandler1 = createMockHandler({ epaSiteId: 'VAT123456789' });
const mockHandler2 = createMockHandler({ epaSiteId: 'TXD123456789' });
const mockSites = [
  createMockRcrainfoSite({ name: 'site 1', handler: mockHandler1 }),
  createMockRcrainfoSite({
    name: 'site 2',
    handler: mockHandler2,
  }),
];
const server = setupServer(
  rest.get(`${API_BASE_URL}/api/site`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockSites));
  })
);

// pre-/post-test hooks
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup();
  vi.resetAllMocks();
});
afterAll(() => server.close()); // Disable API mocking after the tests are done.

describe('SiteList component', () => {
  test('renders', () => {
    renderWithProviders(<SiteList />, {});
  });
  test('fetches sites a user has access to', async () => {
    // Act
    renderWithProviders(<SiteList />);
    let numIds = await screen.findAllByRole('listitem');
    // Assert
    expect(numIds.length).toEqual(mockSites.length);
  });
});
