import { http, HttpResponse } from 'msw';
import { createMockHandler, createMockSite } from '../fixtures';

export const API_BASE_URL = import.meta.env.VITE_HT_API_URL;
const mockEpaId = createMockHandler().epaSiteId;
const mockSites = [createMockSite(), createMockSite()];

export const mockSiteEndpoints = [
  /** List user sites*/
  http.get(`${API_BASE_URL}/api/site`, () => {
    return HttpResponse.json(mockSites, { status: 200 });
  }),
  /** Site Details*/
  http.get(`${API_BASE_URL}/api/site/${mockEpaId}`, () => {
    return HttpResponse.json(mockSites[0], { status: 200 });
  }),
];
