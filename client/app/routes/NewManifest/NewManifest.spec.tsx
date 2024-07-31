import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { NewManifest } from 'routes/NewManifest/NewManifest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { createMockSite } from 'test-utils/fixtures';
import { mockSiteEndpoints, mockUserEndpoints } from 'test-utils/mock';
import { API_BASE_URL } from 'test-utils/mock/mockSiteEndpoints';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';

const mockSites = [createMockSite(), createMockSite()];
const server = setupServer(...mockUserEndpoints, ...mockSiteEndpoints);
server.use(
  http.get(`${API_BASE_URL}/api/site`, () => {
    return HttpResponse.json(mockSites, { status: 200 });
  })
);
afterEach(() => {
  cleanup();
});
beforeAll(() => server.listen());
afterAll(() => server.close()); // Disable API mocking after the tests are done.

describe('NewManifest', () => {
  test('renders', async () => {
    renderWithProviders(<NewManifest />);
    expect(screen.getByRole('combobox', { name: /site Role/i })).toBeInTheDocument();
  });
  test('site type is initially disabled', () => {
    renderWithProviders(<NewManifest />);
    const siteRole = screen.getByRole('combobox', { name: /site Role/i });
    expect(siteRole).toBeDisabled();
  });
  test('site type is not disabled after selecting a site', async () => {
    renderWithProviders(<NewManifest />);
    const siteSelection = screen.getByRole('combobox', { name: /site select/i });
    await userEvent.click(siteSelection);
    await userEvent.keyboard('{enter}');
    expect(
      screen.getByText(new RegExp(`${mockSites[0].handler.epaSiteId}`, 'i'))
    ).toBeInTheDocument();
    const siteRole = screen.getByRole('combobox', { name: /site Role/i });
    expect(siteRole).not.toBeDisabled();
  });
});
