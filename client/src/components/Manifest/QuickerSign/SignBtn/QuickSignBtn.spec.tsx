import '@testing-library/jest-dom';
import { ManifestContext } from 'components/Manifest/ManifestForm';
import { Handler, RcraSiteType } from 'components/Manifest/manifestSchema';
import { QuickSignBtn } from 'components/Manifest/QuickerSign/index';
import { setupServer } from 'msw/node';
import React from 'react';
import { HaztrakProfileResponse } from 'store/userSlice/user.slice';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { createMockMTNHandler } from 'test-utils/fixtures';
import { mockUserEndpoints } from 'test-utils/mock';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { undefined } from 'zod';

const mockProfile: HaztrakProfileResponse = {
  user: 'testuser1',
  sites: [],
  org: {
    name: 'my org',
    rcrainfoIntegrated: true,
    id: '1234',
  },
};

const server = setupServer(...mockUserEndpoints);
afterEach(() => cleanup());
beforeAll(() => server.listen());
afterAll(() => server.close()); // Disable API mocking after the tests are done.

function TestComponent({
  siteType,
  handler,
  signingSite,
  status = 'NotAssigned',
}: {
  siteType?: RcraSiteType;
  handler?: Handler;
  signingSite?: {
    epaSiteId: string;
    siteType: 'generator' | 'designatedFacility' | 'transporter';
    transporterOrder?: number | undefined;
  };
  status?: 'NotAssigned' | 'Pending' | 'Scheduled' | 'InTransit' | 'ReadyForSignature';
}) {
  if (!siteType) siteType = 'Generator';

  return (
    <div>
      {/*@ts-ignore*/}
      <ManifestContext.Provider value={{ status: status, nextSigningSite: signingSite }}>
        <QuickSignBtn siteType={siteType} mtnHandler={handler} onClick={() => undefined} />
      </ManifestContext.Provider>
    </div>
  );
}

describe('QuickSignBtn', () => {
  test('is not disabled when user org is rcrainfo integrated', () => {
    const unsigned_handler = createMockMTNHandler({
      signed: false,
      electronicSignaturesInfo: [],
    });
    renderWithProviders(<TestComponent siteType={'Generator'} handler={unsigned_handler} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
  test('is disabled when API user but already signed', () => {
    const epaSiteId = 'TXD987654321';
    const unsigned_handler = createMockMTNHandler({
      signed: true,
      siteType: 'Generator',
      epaSiteId,
    });
    renderWithProviders(
      <TestComponent
        siteType={'Tsdf'}
        signingSite={{ epaSiteId: 'other_site', siteType: 'transporter' }}
        handler={unsigned_handler}
      />
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
