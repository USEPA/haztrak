/**
 *  RcraProfile tests
 */
import { screen } from '@testing-library/react';
import React from 'react';
import { useAppSelector } from 'store/hooks';
import { renderWithProviders } from 'test-utils';
import { createMockSite } from 'test-utils/fixtures';
import { createMockPermission } from 'test-utils/fixtures/mockHandler';
import rcraProfileReducer, {
  getProfile,
  RcraProfileSite,
  RcraProfileState,
  getSiteByEpaId,
  getUserSites,
} from './rcraProfile.slice';

const initialState: RcraProfileState = {
  user: undefined,
  rcraAPIID: undefined,
  rcraUsername: undefined,
  rcraSites: {},
  phoneNumber: undefined,
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

const profilePayload: RcraProfileState = {
  user: 'testuser1',
  rcraAPIID: 'mockRcraApiId',
  rcraUsername: undefined,
  rcraSites: { [mySite.site.handler.epaSiteId]: mySite },
  phoneNumber: undefined,
};

const errorMsg = 'rejected promise error message';
const rejectedPayload = {
  error: errorMsg,
};

const pendingGetProfile = { type: getProfile.pending };
const fulfilledGetProfile = { type: getProfile.fulfilled, payload: profilePayload };
const rejectedGetProfile = { type: getProfile.rejected, payload: rejectedPayload };
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
  const rcraSite = useAppSelector(getSiteByEpaId(siteId));
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
        rcraProfile: {
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
    });
    expect(screen.getByText(mySite.handler.epaSiteId)).toBeInTheDocument();
  });
  test('retrieve all RcraProfileSites', () => {
    const mySite = createMockSite();
    const TestComp = () => {
      const myRcraSite = useAppSelector(getUserSites);
      return (
        <>
          <p>{myRcraSite ? Object.keys(myRcraSite).length : 'not defined'}</p>
          {myRcraSite
            ? myRcraSite.map((site) => <p>{site.site.handler.epaSiteId}</p>)
            : 'not defined'}
        </>
      );
    };
    renderWithProviders(<TestComp />, {
      preloadedState: {
        rcraProfile: {
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
    });
    screen.debug();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.queryByText(/Not Defined/i)).not.toBeInTheDocument();
  });
});
