import { HaztrakSite } from 'app/components/Site';
import { Handler } from '~/components/Manifest';
import { Transporter } from '~/components/Manifest/Transporter';
import { RcraAddress, RcraSite } from '~/components/RcraSite';
import { RcrainfoSitePermissions } from '~/store';
import { RcraContact } from '~/components/RcraSite/rcraSiteSchema';

/**
 * A api handler object for tests
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

export function createMockRcraAddress(overWrites?: Partial<RcraAddress>): RcraAddress {
  return {
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
    ...overWrites,
  };
}

export function createMockRcraContact(overWrites?: Partial<RcraContact>): RcraContact {
  return {
    phone: {
      number: '703-308-0023',
    },
    email: 'Testing@EPA.GOV',
    ...overWrites,
  };
}

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

export function createMockRcrainfoSite(overWrites?: Partial<RcraSite>): RcraSite {
  return {
    epaSiteId: 'testSiteIdNumber',
    name: 'TEST Generator 1',
    mailingAddress: createMockRcraAddress(),
    siteAddress: createMockRcraAddress(),
    contact: createMockRcraContact(),
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
