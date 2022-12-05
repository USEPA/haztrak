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
  test('renders an array of transporter', () => {
    // We're not going to mock the useFieldArray, opt for integration test.
    const fakeArrayMethods = {}; // non-existent method placeholders
    renderWithProviders(
      <TransporterTable
        // @ts-ignore
        arrayFieldMethods={fakeArrayMethods}
        transporters={TRAN_ARRAY}
      />,
      {}
    );
    expect(screen.getByText(HANDLER_ID_1)).toBeInTheDocument();
    expect(screen.getByText(HANDLER_ID_2)).toBeInTheDocument();
    // debug(undefined, Infinity);
  });
  test('renders actions for each transporter', () => {
    const fakeArrayMethods = {}; // non-existent method placeholders
    const { debug } = renderWithProviders(
      <TransporterTable
        // @ts-ignore
        arrayFieldMethods={fakeArrayMethods}
        transporters={TRAN_ARRAY}
      />,
      {}
    );
    for (let i = 0; i < TRAN_ARRAY.length; i++) {
      expect(
        screen.getByTitle(`remove-transporter-${i}-button`)
      ).toBeInTheDocument();
      expect(
        screen.getByTitle(`move-transporter-${i}-down-button`)
      ).toBeInTheDocument();
      expect(
        screen.getByTitle(`move-transporter-${i}-up-button`)
      ).toBeInTheDocument();
    }
    expect(
      screen.getByTitle(`move-transporter-${TRAN_ARRAY.length - 1}-down-button`)
    ).toBeDisabled();
  });
  test('first move-up and last move-down to be disabled', () => {
    const fakeArrayMethods = {}; // non-existent method placeholders
    const { debug } = renderWithProviders(
      <TransporterTable
        // @ts-ignore
        arrayFieldMethods={fakeArrayMethods}
        transporters={TRAN_ARRAY}
      />,
      {}
    );
    for (let i = 0; i < TRAN_ARRAY.length; i++) {
      if (i === 0) {
        expect(
          screen.getByTitle(`move-transporter-${i}-up-button`)
        ).toBeDisabled();
      } else {
        expect(
          screen.getByTitle(`move-transporter-${i}-up-button`)
        ).not.toBeDisabled();
      }
      if (i === TRAN_ARRAY.length - 1) {
        expect(
          screen.getByTitle(`move-transporter-${i}-down-button`)
        ).toBeDisabled();
      } else {
        expect(
          screen.getByTitle(`move-transporter-${i}-down-button`)
        ).not.toBeDisabled();
      }
    }
  });
});
