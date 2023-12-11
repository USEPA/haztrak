import React from 'react';
import '@testing-library/jest-dom';
import { HandlerSearchForm } from './HandlerSearchForm';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { createMockRcrainfoSite } from 'test-utils/fixtures';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { API_BASE_URL } from 'test-utils/mock/handlers';
import userEvent from '@testing-library/user-event';

const mockRcraSite1Id = 'VATEST111111111';
const mockRcraSite2Id = 'VATEST222222222';
const mockRcrainfoSite1Id = 'VATEST333333333';
const mockRcrainfoSite2Id = 'VATEST444444444';

const mockRcrainfoSite1 = createMockRcrainfoSite({ epaSiteId: mockRcrainfoSite1Id });
const mockRcrainfoSite2 = createMockRcrainfoSite({ epaSiteId: mockRcrainfoSite2Id });
const mockRcraSite1 = createMockRcrainfoSite({ epaSiteId: mockRcraSite1Id });
const mockRcraSite2 = createMockRcrainfoSite({ epaSiteId: mockRcraSite2Id });
export const testURL = [
  http.get(`${API_BASE_URL}/api/site/search`, (info) => {
    return HttpResponse.json([mockRcraSite1, mockRcraSite2], { status: 200 });
  }),
  http.get(`${API_BASE_URL}/api/rcra/handler/search`, (info) => {
    return HttpResponse.json([mockRcrainfoSite1, mockRcrainfoSite2], { status: 200 });
  }),
  http.post(`${API_BASE_URL}/api/rcra/handler/search`, (info) => {
    return HttpResponse.json([mockRcrainfoSite1, mockRcrainfoSite2], { status: 200 });
  }),
];

const server = setupServer(...testURL);
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
      <HandlerSearchForm handleClose={() => undefined} handlerType="generator" />,
      {
        preloadedState: {
          profile: {
            user: 'testuser1',
            org: {
              name: 'my org',
              rcrainfoIntegrated: true,
              id: '1234',
            },
          },
        },
      }
    );
    const epaId = screen.getByRole('combobox');
    await userEvent.type(epaId, 'VATEST');
    expect(await screen.findByText(new RegExp(mockRcraSite1Id, 'i'))).toBeInTheDocument();
    expect(await screen.findByText(new RegExp(mockRcraSite2Id, 'i'))).toBeInTheDocument();
    expect(await screen.findByText(new RegExp(mockRcrainfoSite1Id, 'i'))).toBeInTheDocument();
    expect(await screen.findByText(new RegExp(mockRcrainfoSite2Id, 'i'))).toBeInTheDocument();
  });
  test('retrieves rcra sites from haztrak if org not rcrainfo integrated', async () => {
    renderWithProviders(
      <HandlerSearchForm handleClose={() => undefined} handlerType="generator" />,
      {
        preloadedState: {
          profile: {
            user: 'testuser1',
            org: {
              name: 'my org',
              rcrainfoIntegrated: false,
              id: '1234',
            },
          },
        },
      }
    );
    const epaId = screen.getByRole('combobox');
    await userEvent.type(epaId, 'VATEST');
    expect(await screen.findByText(new RegExp(mockRcraSite1Id, 'i'))).toBeInTheDocument();
    expect(await screen.findByText(new RegExp(mockRcraSite2Id, 'i'))).toBeInTheDocument();
    expect(screen.queryByText(new RegExp(mockRcrainfoSite1Id, 'i'))).not.toBeInTheDocument();
    expect(screen.queryByText(new RegExp(mockRcrainfoSite2Id, 'i'))).not.toBeInTheDocument();
  });
});
