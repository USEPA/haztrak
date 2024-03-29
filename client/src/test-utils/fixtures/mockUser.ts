import { HaztrakProfileOrg, HaztrakUser, RcrainfoProfile, RcrainfoProfileSite } from 'store';
import { HaztrakProfileResponse } from 'store/userSlice/user.slice';
import { createMockSite } from 'test-utils/fixtures/mockHandler';

export const DEFAULT_HAZTRAK_USER: HaztrakUser = {
  username: 'testuser1',
  firstName: 'john',
  lastName: 'smith',
  email: 'test@mail.com',
};

export function createMockHaztrakUser(overWrites?: Partial<HaztrakUser>): HaztrakUser {
  return {
    ...DEFAULT_HAZTRAK_USER,
    ...overWrites,
  };
}

interface RcrainfoProfileResponse extends RcrainfoProfile<Array<RcrainfoProfileSite>> {}

const DEFAULT_RCRAINFO_PROFILE_RESPONSE: RcrainfoProfileResponse = {
  user: 'testuser1',
  rcraAPIID: 'mockRcraAPIID',
  rcraUsername: undefined,
  rcraSites: [],
  phoneNumber: undefined,
  apiUser: true,
};

export function createMockRcrainfoProfileResponse(
  overWrites?: Partial<RcrainfoProfileResponse>
): RcrainfoProfileResponse {
  return {
    ...DEFAULT_RCRAINFO_PROFILE_RESPONSE,
    ...overWrites,
  };
}

export function createMockOrg(overWrites?: Partial<HaztrakProfileOrg>): HaztrakProfileOrg {
  return {
    name: 'mockOrg',
    id: 'mockOrgId',
    rcrainfoIntegrated: true,
    ...overWrites,
  };
}

export function createMockProfileResponse(
  overWrites?: Partial<HaztrakProfileResponse>
): HaztrakProfileResponse {
  return {
    user: DEFAULT_HAZTRAK_USER.username,
    org: createMockOrg(),
    sites: [{ site: createMockSite(), eManifest: 'signer' }],
    ...overWrites,
  };
}
