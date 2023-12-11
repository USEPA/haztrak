import '@testing-library/jest-dom';
import { ManifestContext } from 'components/Manifest/ManifestForm';
import { Handler, RcraSiteType } from 'components/Manifest/manifestSchema';
import { QuickSignBtn } from 'components/Manifest/QuickerSign/index';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { createMockMTNHandler } from 'test-utils/fixtures';
import { afterEach, describe, expect, test } from 'vitest';
import { undefined } from 'zod';

afterEach(() => {
  cleanup();
});

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
  test('renders', () => {
    const handlerId = 'TXD987654321';
    const handler = createMockMTNHandler({ siteType: 'Generator', epaSiteId: handlerId });
    renderWithProviders(
      <TestComponent
        handler={handler}
        signingSite={{ epaSiteId: handlerId, siteType: 'generator' }}
        status={'Scheduled'}
      />,
      {
        preloadedState: {
          profile: {
            user: 'testuser1',
            org: {
              rcrainfoIntegrated: true,
              id: '123',
              name: 'Test Org',
            },
            sites: {
              TXD987654321: {
                name: 'Test Site',
                handler: handler,
                permissions: { eManifest: 'signer' },
              },
            },
          },
        },
      }
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  test('is not disabled when user org is rcrainfo integrated', () => {
    const unsigned_handler = createMockMTNHandler({
      signed: false,
      electronicSignaturesInfo: [],
    });
    renderWithProviders(<TestComponent siteType={'Generator'} handler={unsigned_handler} />, {
      // Redux store state with an API user is required for this button to be active
      preloadedState: {
        profile: {
          org: {
            name: 'Test Org',
            id: '123',
            rcrainfoIntegrated: true,
          },
          user: 'username',
          rcrainfoProfile: {
            user: 'username',
            phoneNumber: '1231231234',
            apiUser: true,
          },
        },
      },
    });
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
      />,
      // Redux store state with an API user is required for this button to be active
      {
        preloadedState: {
          profile: {
            user: 'username',
            rcrainfoProfile: {
              user: 'username',
              phoneNumber: '1231231234',
              apiUser: false,
            },
          },
        },
      }
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
