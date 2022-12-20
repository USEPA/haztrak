/**
 * A mock handler ID, use by the mock handler object, for tests
 */
export const MOCK_EPA_ID = 'testSiteIdNumber';
export const MOCK_USERNAME = 'testuser1';

/**
 * A mock handler object for tests
 */
export const MOCK_HANDLER = {
  epaSiteId: MOCK_EPA_ID,
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

export const MOCK_SITE_OBJECT = {
  name: 'mySiteName',
  handler: MOCK_HANDLER,
};

export const MOCK_SITE_ARRAY = [MOCK_SITE_OBJECT, MOCK_SITE_OBJECT];
