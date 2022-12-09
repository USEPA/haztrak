import { cleanup } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { renderWithProviders, screen } from 'test';
import SiteList from './index';

const API_BASE_URL = process.env.REACT_APP_HT_API_URL;
const HANDLER_EPA_ID = 'testSiteIdNumber';

const HANDLER_OBJECT = {
  epaSiteId: HANDLER_EPA_ID,
  siteType: 'Generator',
  name: 'TEST TRANSPORTER 2 OF VA',
  siteAddress: {
    streetNumber: '123',
    address1: 'VA TEST GEN 2021 WAY',
    city: 'Arlington',
    state: {
      code: 'VA',
      name: 'Virginia',
    },
    country: {
      code: 'US',
      name: 'United States',
    },
    zip: '20022',
  },
  mailingAddress: {
    streetNumber: '123',
    address1: 'VA TEST GEN 2021 WAY',
    city: 'Arlington',
    state: {
      code: 'VA',
      name: 'Virginia',
    },
    country: {
      code: 'US',
      name: 'United States',
    },
    zip: '20022',
  },
  contact: {
    phone: {
      number: '703-308-0023',
    },
    email: 'Testing@EPA.GOV',
  },
  emergencyPhone: {
    number: '888-456-1234',
  },
  electronicSignatureInfo: [
    {
      humanReadableDocument: {
        name: 'human-readable.html',
        size: 177949,
        mimeType: 'TEXT_HTML',
      },
    },
  ],
  hasRegisteredEmanifestUser: true,
  gisPrimary: false,
};

const SITE_ARRAY = [
  {
    name: HANDLER_EPA_ID,
    handler: HANDLER_OBJECT,
  },
  {
    name: 'test site name',
    handler: HANDLER_OBJECT,
  },
];

export const handlers = [
  rest.get(`${API_BASE_URL}/api/trak/site`, (req, res, ctx) => {
    return res(ctx.delay(), ctx.status(200), ctx.json(SITE_ARRAY));
  }),
];

const server = setupServer(...handlers);

// Arrange
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup();
  jest.resetAllMocks();
});
afterAll(() => server.close()); // Disable API mocking after the tests are done.

describe('SiteList component', () => {
  test('renders', () => {
    renderWithProviders(<SiteList />, {});
  });
  test('fetches sites a user has access to', async () => {
    // Act
    renderWithProviders(<SiteList />);
    let numIds = await screen.findAllByRole('cell', { name: HANDLER_EPA_ID });
    // Assert
    expect(numIds.length).toEqual(3);
  });
});
