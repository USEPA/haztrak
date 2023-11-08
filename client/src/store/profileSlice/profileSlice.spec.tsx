/**
 *  RcraProfile tests
 */
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import React from 'react';
import { useAppSelector } from 'store';
import { renderWithProviders } from 'test-utils';
import { createMockRcrainfoSite } from 'test-utils/fixtures';
import { createMockRcrainfoPermissions } from 'test-utils/fixtures/mockHandler';
import { describe, expect, test } from 'vitest';
import rcraProfileReducer, {
  getRcraProfile,
  RcrainfoProfileSite,
  ProfileState,
  siteByEpaIdSelector,
  selectRcrainfoSites,
} from 'store/profileSlice/profile.slice';

interface TestComponentProps {
  siteId: string;
}

function TestComponent({ siteId }: TestComponentProps) {
  const rcraSite = useAppSelector(siteByEpaIdSelector(siteId));
  return (
    <>
      <p>{rcraSite?.epaSiteId}</p>
    </>
  );
}

describe('RcraProfileSlice selectors', () => {
  test('Retrieve RcraProfileSite by EPA ID', () => {
    const mySite = createMockRcrainfoSite();
    renderWithProviders(<TestComponent siteId={mySite.handler.epaSiteId} />, {
      preloadedState: {
        profile: {
          user: 'testuser1',
          sites: { VATESTGEN001: { ...mySite, permissions: { eManifest: 'viewer' } } },
          rcrainfoProfile: {
            user: 'username',
            phoneNumber: '1231231234',
            apiUser: false,
            rcraSites: {
              VATESTGEN001: {
                epaSiteId: mySite.handler.epaSiteId,
                permissions: createMockRcrainfoPermissions(),
              },
            },
          },
        },
      },
    });
    expect(screen.getByText(mySite.handler.epaSiteId)).toBeInTheDocument();
  });
  test('retrieve all RcraProfileSites', () => {
    const mySite = createMockRcrainfoSite();
    const TestComp = () => {
      const myRcraSite = useAppSelector(selectRcrainfoSites);
      return (
        <>
          <p>{myRcraSite ? Object.keys(myRcraSite).length : 'not defined'}</p>
          {myRcraSite
            ? myRcraSite.map((site, index) => (
                <p key={`${site.epaSiteId}-${index}`}>{site.epaSiteId}</p>
              ))
            : 'not defined'}
        </>
      );
    };
    renderWithProviders(<TestComp />, {
      preloadedState: {
        profile: {
          user: 'testuser1',
          rcrainfoProfile: {
            user: 'username',
            phoneNumber: '1231231234',
            apiUser: false,
            rcraSites: {
              VATESTGEN001: {
                epaSiteId: mySite.handler.epaSiteId,
                permissions: createMockRcrainfoPermissions(),
              },
              VATEST00001: {
                epaSiteId: mySite.handler.epaSiteId,
                permissions: createMockRcrainfoPermissions(),
              },
            },
          },
        },
      },
    });
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.queryByText(/Not Defined/i)).not.toBeInTheDocument();
  });
});
