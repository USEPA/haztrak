import { screen } from '@testing-library/react';
import React from 'react';
import { renderWithProviders } from 'test';
import { MOCK_HANDLER } from 'test/fixtures';
import { Transporter } from 'types/Handler/Transporter';
import { TransporterTable } from './index';

const HANDLER_ID_1 = 'siteId1';
const HANDLER_ID_2 = 'siteId2';

const TRAN_ARRAY: Array<Transporter> = [
  {
    ...MOCK_HANDLER,
    epaSiteId: HANDLER_ID_1,
    order: 1,
  },
  {
    ...MOCK_HANDLER,
    epaSiteId: HANDLER_ID_2,
    order: 2,
  },
];

describe('TransporterTable', () => {
  test('renders an array of transporter', () => {
    const emptyArrayFieldMethods = {}; // empty method placeholders to fulfil required prop
    renderWithProviders(
      <TransporterTable
        // @ts-ignore
        arrayFieldMethods={emptyArrayFieldMethods}
        transporters={TRAN_ARRAY}
      />,
      {}
    );
    expect(screen.getByText(HANDLER_ID_1)).toBeInTheDocument();
    expect(screen.getByText(HANDLER_ID_2)).toBeInTheDocument();
    // debug(undefined, Infinity);
  });
  test('renders actions for each transporter', () => {
    const emptyArrayFieldMethods = {}; // empty method placeholders to fulfil required prop
    renderWithProviders(
      <TransporterTable
        // @ts-ignore
        arrayFieldMethods={emptyArrayFieldMethods}
        transporters={TRAN_ARRAY}
        readOnly={false}
      />,
      {}
    );
    for (let i = 0; i < TRAN_ARRAY.length; i++) {
      expect(screen.getByTitle(`remove-transporter-${i}-button`)).toBeInTheDocument();
      expect(screen.getByTitle(`move-transporter-${i}-down-button`)).toBeInTheDocument();
      expect(screen.getByTitle(`move-transporter-${i}-up-button`)).toBeInTheDocument();
    }
    expect(
      screen.getByTitle(`move-transporter-${TRAN_ARRAY.length - 1}-down-button`)
    ).toBeDisabled();
  });
  test('first move-up and last move-down to be disabled', () => {
    const emptyArrayFieldMethods = {}; // empty method placeholders to fulfill required prop
    renderWithProviders(
      <TransporterTable
        // @ts-ignore
        arrayFieldMethods={emptyArrayFieldMethods}
        transporters={TRAN_ARRAY}
      />,
      {}
    );
    for (let i = 0; i < TRAN_ARRAY.length; i++) {
      if (i === 0) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(screen.getByTitle(`move-transporter-${i}-up-button`)).toBeDisabled();
      } else {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(screen.getByTitle(`move-transporter-${i}-up-button`)).not.toBeDisabled();
      }
      if (i === TRAN_ARRAY.length - 1) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(screen.getByTitle(`move-transporter-${i}-down-button`)).toBeDisabled();
      } else {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(screen.getByTitle(`move-transporter-${i}-down-button`)).not.toBeDisabled();
      }
    }
  });
});
