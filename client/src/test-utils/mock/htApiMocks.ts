import { http, HttpResponse } from 'msw';
import { createMockHandler, createMockManifest, createMockSite } from '../fixtures';

export const API_BASE_URL = import.meta.env.VITE_HT_API_URL;
const mockMTN = createMockManifest().manifestTrackingNumber;
const mockEpaId = createMockHandler().epaSiteId;
const mockSites = [createMockSite(), createMockSite()];

export const htApiMocks = [
  /** List user sites*/
  http.get(`${API_BASE_URL}/api/site`, (info) => {
    return HttpResponse.json(mockSites, { status: 200 });
  }),
  /** Site Details*/
  http.get(`${API_BASE_URL}/api/site/${mockEpaId}`, (info) => {
    return HttpResponse.json(mockSites[0], { status: 200 });
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
