/**
 *  RcraProfile tests
 */
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import React from 'react';
import { useAppSelector } from 'store';
import { renderWithProviders } from 'test-utils';
import { createMockSite } from 'test-utils/fixtures';
import { createMockPermission } from 'test-utils/fixtures/mockHandler';
import { describe, expect, test } from 'vitest';
import rcraProfileReducer, {
  getRcraProfile,
  RcraProfileSite,
  ProfileState,
  siteByEpaIdSelector,
  userRcraSitesSelector,
} from 'store/profileSlice/profile.slice';

const initialState: ProfileState = {
  user: undefined,
  rcrainfoProfile: {
    user: undefined,
    rcraAPIID: undefined,
    rcraUsername: undefined,
    rcraSites: {},
    phoneNumber: undefined,
  },
  loading: false,
  error: undefined,
};

const mySite: RcraProfileSite = {
  site: createMockSite(),
  permissions: {
    siteManagement: true,
    annualReport: 'Certifier',
    biennialReport: 'Certifier',
    eManifest: 'Certifier',
    myRCRAid: 'Certifier',
    WIETS: 'Certifier',
  },
};

const profilePayload: ProfileState = {
  user: 'testuser1',
  rcrainfoProfile: {
    user: 'testuser1',
    rcraAPIID: 'mockRcraApiId',
    rcraUsername: undefined,
    rcraSites: { [mySite.site.handler.epaSiteId]: mySite },
    phoneNumber: undefined,
  },
};

const errorMsg = 'rejected promise error message';
const rejectedPayload = {
  error: errorMsg,
};

const pendingGetProfile = { type: getRcraProfile.pending };
const fulfilledGetProfile = { type: getRcraProfile.fulfilled, payload: profilePayload };
const rejectedGetProfile = { type: getRcraProfile.rejected, payload: rejectedPayload };
const pendingProfileState = { ...initialState, loading: true };

describe('rcraProfile', () => {
  test('loading is set to true when pending request', () => {
    expect(rcraProfileReducer(initialState, pendingGetProfile)).toEqual({
      ...initialState,
      loading: true,
    });
  });
  test('fulfilled sets payload to profile state', () => {
    expect(rcraProfileReducer(pendingProfileState, fulfilledGetProfile)).toEqual({
      ...profilePayload,
      loading: false,
      error: undefined,
    });
  });
  test('rejected state sets error', () => {
    expect(rcraProfileReducer(pendingProfileState, rejectedGetProfile)).toEqual({
      ...pendingProfileState,
      error: errorMsg,
      loading: false,
    });
  });
});

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
    const mySite = createMockSite();
    renderWithProviders(<TestComponent siteId={mySite.handler.epaSiteId} />, {
      preloadedState: {
        profile: {
          user: 'testuser1',
          rcrainfoProfile: {
            user: 'username',
            phoneNumber: '1231231234',
            apiUser: false,
            rcraSites: {
              VATESTGEN001: {
                site: mySite,
                permissions: createMockPermission(),
              },
            },
          },
        },
      },
    });
    expect(screen.getByText(mySite.handler.epaSiteId)).toBeInTheDocument();
  });
  test('retrieve all RcraProfileSites', () => {
    const mySite = createMockSite();
    const TestComp = () => {
      const myRcraSite = useAppSelector(userRcraSitesSelector);
      return (
        <>
          <p>{myRcraSite ? Object.keys(myRcraSite).length : 'not defined'}</p>
          {myRcraSite
            ? myRcraSite.map((site, index) => (
                <p key={`${site.site.handler.epaSiteId}-${index}`}>{site.site.handler.epaSiteId}</p>
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
                site: mySite,
                permissions: createMockPermission(),
              },
              VATEST00001: {
                site: mySite,
                permissions: createMockPermission(),
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
