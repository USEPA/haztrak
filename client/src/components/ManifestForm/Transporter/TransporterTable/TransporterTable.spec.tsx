import React from 'react';
import { renderWithProviders } from 'test';
import { screen } from '@testing-library/react';
import { TransporterTable } from './index';
import { Transporter } from 'types/Transporter/Transporter';

const HANDLER_ID_1 = 'siteId1';
const HANDLER_ID_2 = 'siteId2';

const HANDLER_OBJECT = {
  epaSiteId: HANDLER_ID_1,
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

const TRAN_ARRAY: Array<Transporter> = [
  {
    ...HANDLER_OBJECT,
    order: 1,
  },
  {
    ...HANDLER_OBJECT,
    epaSiteId: HANDLER_ID_2,
    order: 2,
  },
];

describe('TransporterTable', () => {
  test('renders transporter', () => {
    /**
     * We're not going to mock the useFieldArray, opt for integration test.
     * This weak unit test just checks if an existing array of transporters is
     * rendered in the table
     */
    const fakeArrayMethods = {};
    const { debug } = renderWithProviders(
      <TransporterTable
        // @ts-ignore
        arrayFieldMethods={fakeArrayMethods}
        transporters={TRAN_ARRAY}
      />,
      {}
    );
    expect(screen.getByText(HANDLER_ID_1)).toBeInTheDocument();
    expect(screen.getByText(HANDLER_ID_2)).toBeInTheDocument();
    debug(undefined, Infinity);
  });
});
