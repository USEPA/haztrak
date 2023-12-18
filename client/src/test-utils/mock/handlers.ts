import { http, HttpResponse } from 'msw';
import { createMockHandler, createMockManifest, createMockSite } from '../fixtures';

export const API_BASE_URL = import.meta.env.VITE_HT_API_URL;
const mockMTN = createMockManifest().manifestTrackingNumber;
const mockEpaId = createMockHandler().epaSiteId;
const mockUsername = 'testuser1';
const mockSites = [createMockSite(), createMockSite()];

export const handlers = [
  /** Login endpoint*/
  http.post(`${API_BASE_URL}/api/user/login`, (info) => {
    // Persist user's authentication in the session
    sessionStorage.setItem('token', 'this_is_a_fake_token');
    sessionStorage.setItem('user', mockUsername);

    // Mock response from haztrak API
    return HttpResponse.json(
      {
        token: 'fake_token',
        user: mockUsername,
      },
      { status: 200 }
    );
  }),
  /** User RcraProfile data*/
  http.get(`${API_BASE_URL}/api/user/rcrainfo-profile/${mockUsername}`, (info) => {
    return HttpResponse.json(
      {
        user: mockUsername,
        rcraAPIID: 'mockRcraAPIID',
        rcraUsername: undefined,
        epaSites: [],
        phoneNumber: undefined,
        apiUser: true,
      },
      { status: 200 }
    );
  }),
  /** List user sites*/
  http.get(`${API_BASE_URL}/api/site`, (info) => {
    return HttpResponse.json(mockSites, { status: 200 });
  }),
  /** Site Details*/
  http.get(`${API_BASE_URL}/api/site/${mockEpaId}`, (info) => {
    return HttpResponse.json(mockSites[0], { status: 200 });
  }),
  /** mock Manifest*/
  http.get(`${API_BASE_URL}/api/rcra/manifest/${mockMTN}`, (info) => {
    return HttpResponse.json(createMockManifest(), { status: 200 });
  }),
  /** list of manifests ('My Manifests' feature and a site's manifests)*/
  http.get(`${API_BASE_URL}/api/rcra/mtn*`, (info) => {
    const mockManifestArray = [
      createMockManifest(),
      createMockManifest({ manifestTrackingNumber: '987654321ELC', status: 'Pending' }),
    ];
    return HttpResponse.json(mockManifestArray, { status: 200 });
  }),
];
