/**
 *  RcraProfile tests
 */
import { createMockSite } from 'test-utils/fixtures';
import rcraProfileReducer, {
  getProfile,
  RcraSitePermissions,
  RcraProfileState,
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

const mySite: RcraSitePermissions = {
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
