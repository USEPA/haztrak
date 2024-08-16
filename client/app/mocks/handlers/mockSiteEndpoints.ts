import { http, HttpResponse } from 'msw';
import { createMockOrg } from '~/mocks/fixtures/mockUser';
import { createMockHandler, createMockSite } from '../fixtures';

export const API_BASE_URL = import.meta.env.VITE_HT_API_URL;
const mockSites = [createMockSite(), createMockSite()];
const mockOrgs = [
  createMockOrg(),
  createMockOrg({
    slug: 'org-2',
    name: 'org number 2',
    rcrainfoIntegrated: false,
  }),
];

export const mockSiteEndpoints = [
  /** List user sites*/
  http.get(`${API_BASE_URL}/api/sites`, () => {
    return HttpResponse.json(mockSites, { status: 200 });
  }),
  /** Site Details*/
  http.get(`${API_BASE_URL}/api/sites/:siteId`, (info) => {
    const { siteId } = info.params;
    if (typeof siteId !== 'string')
      return HttpResponse.json({ message: 'Invalid site ID' }, { status: 400 });
    return HttpResponse.json(
      createMockSite({
        handler: {
          ...createMockHandler(),
          epaSiteId: siteId,
        },
      }),
      { status: 200 }
    );
  }),
  /** Org list*/
  http.get(`${API_BASE_URL}/api/orgs`, () => {
    return HttpResponse.json(mockOrgs, { status: 200 });
  }),
  /** Org Details*/
  http.get(`${API_BASE_URL}/api/orgs/:orgSlug`, (info) => {
    const { orgSlug } = info.params;
    const myOrg = mockOrgs.find((org) => org.slug === orgSlug);
    return HttpResponse.json(myOrg, { status: 200 });
  }),
];
