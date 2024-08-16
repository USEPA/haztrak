import { screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { ManifestList } from './ManifestList';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { mockManifestEndpoints, mockUserEndpoints } from '~/mocks/handlers';
import { Manifest } from '~/components/Manifest';
import { delay, http, HttpResponse } from 'msw';
import { API_BASE_URL } from '~/mocks/handlers/mockSiteEndpoints';
import { renderWithProviders } from '~/mocks';
import { createMockManifest } from '~/mocks/fixtures';

const server = setupServer(...mockManifestEndpoints, ...mockUserEndpoints);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

vi.mock('~/hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('~/hooks')>()),
  useTitle: vi.fn(),
}));

vi.mock('~/components/Mtn', () => ({
  MtnTable: ({ manifests }: { manifests: Manifest[]; pageSize: number }) => (
    <table>
      <tbody>
        {manifests.map((manifest) => (
          <tr key={manifest.manifestTrackingNumber}>
            <td>{manifest.manifestTrackingNumber}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

describe('ManifestList', () => {
  it('renders the manifest list with data', async () => {
    renderWithProviders(<ManifestList />);

    await waitFor(() => {
      expect(screen.getByText('123456789ELC')).toBeInTheDocument();
      expect(screen.getByText('987654321ELC')).toBeInTheDocument();
    });
  });

  it('renders loading spinner when data is loading', async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/manifest`, async () => {
        await delay(700);
        return HttpResponse.json(
          [
            createMockManifest({ manifestTrackingNumber: '123456789ELC' }),
            createMockManifest({ manifestTrackingNumber: '987654321ELC' }),
          ],
          {
            status: 200,
          }
        );
      })
    );

    renderWithProviders(<ManifestList />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('disables Sync button when siteId is not available', () => {
    renderWithProviders(<ManifestList />);

    expect(screen.getByRole('button', { name: /sync/i })).toBeDisabled();
  });
});
