import { cleanup, waitFor } from '@testing-library/react';
import { renderWithProviders, screen } from '~/mocks';
import { mockUserEndpoints, mockWasteEndpoints } from '~/mocks/handlers';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { useUserSiteIds } from '~/hooks';
import { createMockHandler, createMockSite } from '~/mocks/fixtures';
import { createMockProfileResponse } from '~/mocks/fixtures/mockUser';
import { API_BASE_URL } from '~/mocks/handlers/mockSiteEndpoints';

function TestComponent() {
  const { userSiteIds, isLoading } = useUserSiteIds();
  return (
    <>
      {isLoading && <p>Loading...</p>}
      {userSiteIds.map((epaSiteId, index) => (
        <p key={index}>{epaSiteId}</p>
      ))}
    </>
  );
}

const server = setupServer(...mockUserEndpoints, ...mockWasteEndpoints);
beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => cleanup());

describe('useUserSiteId hook', () => {
  // ToDo: Fix our profile API expected response
  it.skip('retrieves a users site ids', async () => {
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
