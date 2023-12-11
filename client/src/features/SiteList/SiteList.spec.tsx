import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { renderWithProviders, screen } from 'test-utils';
import { createMockHandler, createMockSite } from 'test-utils/fixtures/mockHandler';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { SiteList } from './SiteList';

const mockHandler1 = createMockHandler({ epaSiteId: 'VAT987654321' });
const mockHandler2 = createMockHandler({ epaSiteId: 'VAT123456789' });
const mockSites = [
  createMockSite({ handler: mockHandler1 }),
  createMockSite({ handler: mockHandler2 }),
];
const server = setupServer(
  http.get(`${import.meta.env.VITE_HT_API_URL}/api/site`, (info) => {
    return HttpResponse.json(mockSites, { status: 200 });
  })
);

// pre-/post-test hooks
beforeAll(() => server.listen());
afterAll(() => server.close()); // Disable API mocking after the tests are done.

describe('SiteList component', () => {
  test('renders', () => {
    renderWithProviders(<SiteList />, {});
  });
  test('fetches displays all sites a user has access to', async () => {
    // Act
    renderWithProviders(<SiteList />);
    let numIds = await screen.findAllByRole('listitem');
    // Assert
    expect(numIds.length).toEqual(mockSites.length);
  });
});
