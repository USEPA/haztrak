import { HaztrakSite } from 'components/HaztrakSite';
import { Handler } from 'components/Manifest';
import { Transporter } from 'components/Manifest/Transporter';
import { RcraSite } from 'components/RcraSite';
import { RcrainfoSitePermissions } from 'store';

/**
 * A mock handler object for tests
 */
const DEFAULT_HANDLER: Handler = {
  epaSiteId: 'testSiteIdNumber',
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
  electronicSignaturesInfo: [
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

export function createMockHandler(overWrites?: Partial<RcraSite>): RcraSite {
  return {
    ...DEFAULT_HANDLER,
    ...overWrites,
  };
}

export function createMockMTNHandler(overWrites?: Partial<Handler>): Handler {
  return {
    ...createMockHandler(),
    electronicSignaturesInfo: [],
    ...overWrites,
  };
}

export function createMockSite(overWrites?: Partial<HaztrakSite>): HaztrakSite {
  return {
    handler: createMockHandler(overWrites?.handler),
    name: 'mySiteName',
    ...overWrites,
  };
}

export function createMockRcrainfoSite(overWrites?: Partial<HaztrakSite>): HaztrakSite {
  return {
    handler: createMockHandler(overWrites?.handler),
    name: 'mySiteName',
    ...overWrites,
  };
}

export function createMockTransporter(overWrites?: Partial<Transporter>): Transporter {
  return {
    ...createMockHandler(),
    order: 1,
    ...overWrites,
  };
}

export function createMockRcrainfoPermissions(
  overWrites?: Partial<RcrainfoSitePermissions>
): RcrainfoSitePermissions {
  return {
    siteManagement: true,
    eManifest: 'Certifier',
    biennialReport: 'Certifier',
    WIETS: 'Certifier',
    annualReport: 'Certifier',
    myRCRAid: 'Certifier',
    ...overWrites,
  };
}
