import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import '@testing-library/jest-dom';
import { HaztrakProfileResponse } from 'store/userSlice/user.slice';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { createMockRcrainfoSite } from 'test-utils/fixtures';
import { userApiMocks } from 'test-utils/mock';
import { API_BASE_URL } from 'test-utils/mock/htApiMocks';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
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
    rcrainfoIntegrated: true,
    id: '1234',
  },
};

const mockRcrainfoSite1 = createMockRcrainfoSite({ epaSiteId: mockRcrainfoSite1Id });
const mockRcrainfoSite2 = createMockRcrainfoSite({ epaSiteId: mockRcrainfoSite2Id });
const mockRcraSite1 = createMockRcrainfoSite({ epaSiteId: mockRcraSite1Id });
const mockRcraSite2 = createMockRcrainfoSite({ epaSiteId: mockRcraSite2Id });
export const mockHandlerSearches = [
  http.get(`${API_BASE_URL}/api/site/search`, () => {
    return HttpResponse.json([mockRcraSite1, mockRcraSite2], { status: 200 });
  }),
  http.get(`${API_BASE_URL}/api/rcra/handler/search`, () => {
    return HttpResponse.json([mockRcrainfoSite1, mockRcrainfoSite2], { status: 200 });
  }),
  http.get(`${API_BASE_URL}/api/user/profile`, () => {
    return HttpResponse.json({ ...mockProfile }, { status: 200 });
  }),
  http.post(`${API_BASE_URL}/api/rcra/handler/search`, () => {
    return HttpResponse.json([mockRcrainfoSite1, mockRcrainfoSite2], { status: 200 });
  }),
];

const server = setupServer(...userApiMocks, ...mockHandlerSearches);
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
  test('retrieves rcra sites from haztrak and RCRAInfo', async () => {
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
      http.get(`${API_BASE_URL}/api/user/profile`, () => {
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
