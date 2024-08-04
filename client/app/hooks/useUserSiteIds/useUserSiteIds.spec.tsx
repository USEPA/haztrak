import { cleanup, waitFor } from '@testing-library/react';
import { useUserSiteIds } from '~/hooks';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { renderWithProviders, screen } from 'app/mocks';
import { createMockHandler, createMockSite } from '~/mocks/fixtures';
import { createMockProfileResponse } from '~/mocks/fixtures/mockUser';
import { mockUserEndpoints, mockWasteEndpoints } from 'app/mocks/handlers';
import { API_BASE_URL } from '~/mocks/handlers/mockSiteEndpoints';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

function TestComponent() {
  const { userSiteIds, isLoading } = useUserSiteIds();
  return (
    <>
      {isLoading && <p>Loading...</p>}
      {userSiteIds.map((site, index) => (
        <p key={index}>{site.epaSiteId}</p>
      ))}
    </>
  );
}

const server = setupServer(...mockUserEndpoints, ...mockWasteEndpoints);
beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => cleanup());

describe('useUserSiteId hook', () => {
  it('retrieves a users site ids', async () => {
    const generatorSiteId = 'MOCKVAGEN001';
    const tsdfSiteId = 'MOCKVATSDF001';
    const userGeneratorSite = createMockSite({
      handler: createMockHandler({
        siteType: 'Generator',
        epaSiteId: generatorSiteId,
      }),
    });
    const userTsdfSite = createMockSite({
      handler: createMockHandler({
        siteType: 'Tsdf',
        epaSiteId: tsdfSiteId,
      }),
    });
    server.use(
      http.get(`${API_BASE_URL}/api/profile`, () => {
        return HttpResponse.json(
          {
            ...createMockProfileResponse({
              sites: [
                {
                  site: userGeneratorSite,
                  eManifest: 'viewer',
                },
                {
                  site: userTsdfSite,
                  eManifest: 'signer',
                },
              ],
            }),
          },
          { status: 200 }
        );
      })
    );
    renderWithProviders(<TestComponent />);
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    expect(screen.getByText(generatorSiteId)).toBeInTheDocument();
    expect(screen.getByText(tsdfSiteId)).toBeInTheDocument();
  });
});
