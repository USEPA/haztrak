import { rest } from 'msw';
import { createMockHandler, createMockManifest, createMockSite } from '../fixtures';

export const API_BASE_URL = 'http://localhost:8000';
const mockMTN = createMockManifest().manifestTrackingNumber;
const mockEpaId = createMockHandler().epaSiteId;
const mockUsername = 'testuser1';
const mockSites = [createMockSite(), createMockSite()];

export const handlers = [
  /**
   * Login endpoint
   */
  rest.post(`${API_BASE_URL}/api/user/login`, (req, res, ctx) => {
    // Persist user's authentication in the session
    sessionStorage.setItem('token', 'this_is_a_fake_token');
    sessionStorage.setItem('user', mockUsername);

    // Mock response from haztrak API
    return res(
      ctx.status(200),
      ctx.json({
        token: 'fake_token',
        user: mockUsername,
      })
    );
  }),
  /**
   * User RcraProfile data
   */
  rest.get(`${API_BASE_URL}/api/profile/${mockUsername}`, (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        user: mockUsername,
        rcraAPIID: 'mockRcraAPIID',
        rcraUsername: undefined,
        epaSites: [],
        phoneNumber: undefined,
        apiUser: true,
      })
    );
  }),
  /**
   * List user sites
   */
  rest.get(`${API_BASE_URL}/api/site`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockSites));
  }),
  /**
   * Site Details
   */
  rest.get(`${API_BASE_URL}/api/site/${mockEpaId}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockSites[0]));
  }),
  /**
   * mock Manifest
   */
  rest.get(`${API_BASE_URL}/api/manifest/${mockMTN}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(createMockManifest()));
  }),
  /**
   * list of manifests ('My Manifests' feature and a site's manifests)
   */
  rest.get(`${API_BASE_URL}/api/mtn*`, (req, res, ctx) => {
    const mockManifestArray = [
      createMockManifest(),
      createMockManifest({ manifestTrackingNumber: '987654321ELC', status: 'Pending' }),
    ];
    return res(ctx.status(200), ctx.json(mockManifestArray));
  }),
];
