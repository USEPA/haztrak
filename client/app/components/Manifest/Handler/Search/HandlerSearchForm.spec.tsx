import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, renderWithProviders, screen } from '~/mocks';
import { createMockRcrainfoSite } from '~/mocks/fixtures';
import { mockUserEndpoints } from '~/mocks/handlers';
import { API_BASE_URL } from '~/mocks/handlers/mockSiteEndpoints';
import { HaztrakProfileResponse } from '~/store/userApi/userApi';
import { HandlerSearchForm } from './HandlerSearchForm';

const mockRcraSite1Id = 'VATEST111111111';
const mockRcraSite2Id = 'VATEST222222222';
const mockRcrainfoSite1Id = 'VATEST333333333';
const mockRcrainfoSite2Id = 'VATEST444444444';

const mockProfile: HaztrakProfileResponse = {
  user: 'testuser1',
  sites: [],
  org: {
    name: 'my org',
    slug: 'my-org',
    rcrainfoIntegrated: true,
    id: '1234',
  },
};

const mockRcrainfoSite1 = createMockRcrainfoSite({ epaSiteId: mockRcrainfoSite1Id });
const mockRcrainfoSite2 = createMockRcrainfoSite({ epaSiteId: mockRcrainfoSite2Id });
const mockRcraSite1 = createMockRcrainfoSite({ epaSiteId: mockRcraSite1Id });
const mockRcraSite2 = createMockRcrainfoSite({ epaSiteId: mockRcraSite2Id });
export const mockHandlerSearches = [
  http.get(`${API_BASE_URL}/api/rcrasite/search`, () => {
    return HttpResponse.json([mockRcraSite1, mockRcraSite2], { status: 200 });
  }),
  // ToDo: remove this
  http.get(`${API_BASE_URL}/api/rcrainfo/rcrasite/search`, () => {
    return HttpResponse.json([mockRcrainfoSite1, mockRcrainfoSite2], { status: 200 });
  }),
  http.get(`${API_BASE_URL}/api/my-profile`, () => {
    return HttpResponse.json({ ...mockProfile }, { status: 200 });
  }),
  http.post(`${API_BASE_URL}/api/rcrainfo/rcrasite/search`, () => {
    return HttpResponse.json([mockRcrainfoSite1, mockRcrainfoSite2], { status: 200 });
  }),
];

const server = setupServer(...mockUserEndpoints, ...mockHandlerSearches);
afterEach(() => {
  cleanup();
});
beforeAll(() => server.listen());
afterAll(() => server.close()); // Disable API mocking after the tests are done.

describe('HandlerSearchForm', () => {
  test('renders with basic information inputs', () => {
    renderWithProviders(
      <HandlerSearchForm handleClose={() => undefined} handlerType="generator" />
    );
    expect(screen.getByText(/EPA ID/i)).toBeInTheDocument();
  });
  // ToDo: Fix our profile API expected response
  test.skip('retrieves rcra sites from haztrak and RCRAInfo', async () => {
    renderWithProviders(
      <HandlerSearchForm handleClose={() => undefined} handlerType="generator" />
    );
    const epaId = screen.getByRole('combobox');
    await userEvent.type(epaId, 'VATEST');
    expect(await screen.findByText(new RegExp(mockRcraSite1Id, 'i'))).toBeInTheDocument();
    expect(await screen.findByText(new RegExp(mockRcraSite2Id, 'i'))).toBeInTheDocument();
    expect(await screen.findByText(new RegExp(mockRcrainfoSite1Id, 'i'))).toBeInTheDocument();
    expect(await screen.findByText(new RegExp(mockRcrainfoSite2Id, 'i'))).toBeInTheDocument();
  });
  test('retrieves rcra sites from haztrak if org not rcrainfo integrated', async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/my-profile`, () => {
        return HttpResponse.json(
          {
            ...mockProfile,
            org: { rcrainfoIntegrated: false },
          },
          { status: 200 }
        );
      })
    );
    renderWithProviders(
      <HandlerSearchForm handleClose={() => undefined} handlerType="generator" />
    );
    const epaId = screen.getByRole('combobox');
    await userEvent.type(epaId, 'VATEST');
    expect(await screen.findByText(new RegExp(mockRcraSite1Id, 'i'))).toBeInTheDocument();
    expect(await screen.findByText(new RegExp(mockRcraSite2Id, 'i'))).toBeInTheDocument();
    expect(screen.queryByText(new RegExp(mockRcrainfoSite1Id, 'i'))).not.toBeInTheDocument();
    expect(screen.queryByText(new RegExp(mockRcrainfoSite2Id, 'i'))).not.toBeInTheDocument();
  });
});
