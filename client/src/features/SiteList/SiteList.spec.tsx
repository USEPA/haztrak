import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { createMockHandler, createMockRcrainfoSite } from 'test-utils/fixtures/mockHandler';
import { API_BASE_URL } from 'test-utils/mock/handlers';
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { SiteList } from './SiteList';

const mockSites = [createMockRcrainfoSite(), createMockRcrainfoSite()];
const server = setupServer(
  http.get(`${API_BASE_URL}/api/site`, (info) => {
    return HttpResponse.json(mockSites, { status: 200 });
  })
);
const handler = createMockHandler();

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
    let numIds = await screen.findAllByRole('cell', { name: handler.epaSiteId });
    // Assert
    expect(numIds.length).toEqual(mockSites.length);
  });
});
