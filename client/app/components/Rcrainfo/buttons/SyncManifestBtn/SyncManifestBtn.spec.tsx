import { SyncManifestBtn } from '~/components/Rcrainfo/buttons/SyncManifestBtn/SyncManifestBtn';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'app/mocks';
import { mockUserEndpoints } from 'app/mocks/handlers';
import { API_BASE_URL } from '~/mocks/handlers/mockSiteEndpoints';
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

const testTaskID = 'testTaskId';

const server = setupServer(...mockUserEndpoints);
server.use(
  http.post(`${API_BASE_URL}manifest/emanifest/sync`, () => {
    // Mock Sync Site Manifests response
    return HttpResponse.json(
      {
        task: testTaskID,
      },
      { status: 200 }
    );
  })
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' })); // setup mock http server
afterEach(() => {
  server.resetHandlers();
  cleanup();
  vi.resetAllMocks();
});
afterAll(() => server.close()); // Disable API mocking after the tests are done.

describe('SyncManifestBtn', () => {
  test('renders', () => {
    renderWithProviders(<SyncManifestBtn siteId={'VATESTGEN001'} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  test('can be disabled', () => {
    renderWithProviders(<SyncManifestBtn disabled={true} siteId={'VATESTGEN001'} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
