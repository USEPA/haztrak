import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { cleanup, renderWithProviders, screen } from '~/mocks';
import { mockSiteEndpoints, mockUserEndpoints } from '~/mocks/handlers';

import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import NewManifest from '~/features/newManifest';
import { createMockSite } from '~/mocks/fixtures';
import { API_BASE_URL } from '~/mocks/handlers/mockSiteEndpoints';

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
