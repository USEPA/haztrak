import '@testing-library/jest-dom';
import React from 'react';
import { renderWithProviders, screen } from 'test-utils';
import { TransporterTable } from './index';
import { createMockTransporter } from 'test-utils/fixtures';
import { Transporter } from 'components/Manifest';
import { describe, test, expect } from 'vitest';

const HANDLER_ID_1 = 'siteId1';
const HANDLER_ID_2 = 'siteId2';

const mockSetupSign = (data: any) => console.log(data);

const TRAN_ARRAY: Array<Transporter> = [
  {
    ...createMockTransporter({ epaSiteId: HANDLER_ID_1, order: 1 }),
  },
  {
    ...createMockTransporter({ epaSiteId: HANDLER_ID_2, order: 2 }),
  },
];

describe('TransporterTable', () => {
  test('renders an array of transporter', () => {
    const emptyArrayFieldMethods = {}; // empty method placeholders to fulfil required prop
    renderWithProviders(
      <TransporterTable
        setupSign={mockSetupSign}
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
        setupSign={mockSetupSign}
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
  test('first increase order button is disabled', () => {
    const emptyArrayFieldMethods = {}; // empty method placeholders to fulfill required prop
    renderWithProviders(
      <TransporterTable
        setupSign={mockSetupSign}
        // @ts-ignore
        arrayFieldMethods={emptyArrayFieldMethods}
        transporters={TRAN_ARRAY}
      />,
      {}
    );
    expect(screen.getByTitle(`move-transporter-${0}-up-button`)).toBeDisabled();
  });
  test('move-up is enabled for all but first', () => {
    const emptyArrayFieldMethods = {}; // empty method placeholders to fulfill required prop
    renderWithProviders(
      <TransporterTable
        setupSign={mockSetupSign}
        // @ts-ignore
        arrayFieldMethods={emptyArrayFieldMethods}
        transporters={TRAN_ARRAY}
      />,
      {}
    );
    for (let i = 1; i < TRAN_ARRAY.length; i++) {
      expect(screen.getByTitle(`move-transporter-${i}-up-button`)).not.toBeDisabled();
    }
  });
  test('last move-down is disabled', () => {
    const emptyArrayFieldMethods = {}; // empty method placeholders to fulfill required prop
    renderWithProviders(
      <TransporterTable
        setupSign={mockSetupSign}
        // @ts-ignore
        arrayFieldMethods={emptyArrayFieldMethods}
        transporters={TRAN_ARRAY}
      />,
      {}
    );
    for (let i = 0; i < TRAN_ARRAY.length; i++) {
      expect(
        screen.getByTitle(`move-transporter-${TRAN_ARRAY.length - 1}-down-button`)
      ).toBeDisabled();
    }
  });
  test('move-down is enabled for all but last', () => {
    const emptyArrayFieldMethods = {}; // empty method placeholders to fulfill required prop
    renderWithProviders(
      <TransporterTable
        setupSign={mockSetupSign}
        // @ts-ignore
        arrayFieldMethods={emptyArrayFieldMethods}
        transporters={TRAN_ARRAY}
      />,
      {}
    );
    for (let i = 0; i < TRAN_ARRAY.length - 1; i++) {
      expect(screen.getByTitle(`move-transporter-${i}-down-button`)).not.toBeDisabled();
    }
  });
});
