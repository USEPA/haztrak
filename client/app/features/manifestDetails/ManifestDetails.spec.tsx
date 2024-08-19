import { screen, waitFor } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { ManifestDetails } from './ManifestDetails';
import { setupServer } from 'msw/node';
import { mockManifestEndpoints } from '~/mocks/handlers';
import { cleanup, renderWithProviders } from '~/mocks';
import { delay, http, HttpResponse } from 'msw';
import { createMockManifest } from '~/mocks/fixtures';
import { API_BASE_URL } from '~/mocks/handlers/mockManifestEndpoints';

vi.mock('~/hooks', () => ({
  useTitle: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useParams: vi.fn().mockReturnValue({ mtn: '123456789ELC', action: 'read', siteId: '123' }),
}));

const server = setupServer(...mockManifestEndpoints);
afterEach(() => cleanup());
beforeAll(() => server.listen());
afterAll(() => server.close());

describe('ManifestDetails', () => {
  const waitForLoading = async () => {
    await waitFor(() => expect(screen.getByTestId(/spinner/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByTestId(/spinner/i)).not.toBeInTheDocument());
  };

  it('renders loading spinner when data is loading', () => {
    server.use(
      http.get(`${API_BASE_URL}/api/manifest/:mtn`, async (info) => {
        await delay(1000);
        const { mtn } = info.params;
        if (typeof mtn !== 'string') return HttpResponse.json(null, { status: 400 });
        return HttpResponse.json(createMockManifest({ manifestTrackingNumber: mtn }), {
          status: 200,
        });
      })
    );
    renderWithProviders(<ManifestDetails />, {
      routerProps: { initialEntries: ['/manifest/123456789ELC/read'] },
    });
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders error message when there is an error', async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/manifest/:mtn`, async () => {
        return HttpResponse.json(null, { status: 400 });
      })
    );

    renderWithProviders(<ManifestDetails />);
    await waitForLoading();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
