import '@testing-library/jest-dom';
import { SyncManifestBtn } from 'components/buttons';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { API_BASE_URL } from 'test-utils/mock/handlers';
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

const testTaskID = 'testTaskId';

const server = setupServer(
  ...[
    rest.post(`${API_BASE_URL}rcra/manifest/sync`, (req, res, ctx) => {
      // Mock Sync Site Manifests response
      return res(
        ctx.status(200),
        ctx.json({
          task: testTaskID,
        })
      );
    }),
  ]
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
