import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Transporter } from 'components/Manifest';
import { setupServer } from 'msw/node';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { createMockTransporter } from 'test-utils/fixtures';
import { userApiMocks } from 'test-utils/mock';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { TransporterTable } from './index';

const HANDLER_ID_1 = 'siteId1';
const HANDLER_ID_2 = 'siteId2';
const HANDLER_NAME_1 = 'My Transporter';
const HANDLER_NAME_2 = 'My Other Transporter';

const mockSetupSign = () => undefined;

const TRAN_ARRAY: Array<Transporter> = [
  {
    ...createMockTransporter({ epaSiteId: HANDLER_ID_1, name: HANDLER_NAME_1, order: 1 }),
  },
  {
    ...createMockTransporter({ epaSiteId: HANDLER_ID_2, name: HANDLER_NAME_2, order: 2 }),
  },
];
const server = setupServer(...userApiMocks);
afterEach(() => cleanup());
beforeAll(() => server.listen());
afterAll(() => server.close());

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
    expect(screen.getByText(HANDLER_NAME_1)).toBeInTheDocument();
    expect(screen.getByText(HANDLER_NAME_2)).toBeInTheDocument();
    // debug(undefined, Infinity);
  });
  test('renders an action dropdown when editable', async () => {
    const emptyArrayFieldMethods = {}; // empty method placeholders to fulfill required prop
    renderWithProviders(
      <TransporterTable
        setupSign={mockSetupSign}
        // @ts-ignore
        arrayFieldMethods={emptyArrayFieldMethods}
        transporters={TRAN_ARRAY}
        readOnly={false}
      />,
      { preloadedState: { manifest: { readOnly: false } } }
    );
    const actionDropdown = await screen.findAllByRole('button', {
      name: /transporter [0-9] actions/,
    });
    expect(actionDropdown).length(2);
  });
  test('does not renders an action dropdown when readonly', () => {
    const emptyArrayFieldMethods = {}; // empty method placeholders to fulfill required prop
    renderWithProviders(
      <TransporterTable
        setupSign={mockSetupSign}
        // @ts-ignore
        arrayFieldMethods={emptyArrayFieldMethods}
        transporters={TRAN_ARRAY}
        readOnly={true}
      />,
      {}
    );
    const actionDropdown = screen.queryAllByRole('button', {
      name: /transporter [0-9] actions/,
    });
    expect(actionDropdown).length(0);
  });
  test('move-up is enabled for all but first', async () => {
    const emptyArrayFieldMethods = {}; // empty method placeholders to fulfill required prop
    renderWithProviders(
      <TransporterTable
        setupSign={mockSetupSign}
        // @ts-ignore
        arrayFieldMethods={emptyArrayFieldMethods}
        transporters={TRAN_ARRAY}
      />,
      { preloadedState: { manifest: { readOnly: false } } }
    );
    const actionDropdowns = await screen.findAllByRole('button', {
      name: /transporter [0-9] actions/,
    });
    for (let i = 1; i < TRAN_ARRAY.length; i++) {
      await userEvent.click(actionDropdowns[i]);
      expect(screen.getByTitle(`move transporter ${i} up`)).not.toBeDisabled();
    }
  });
  test('All but last move-down buttons are not disabled', async () => {
    const emptyArrayFieldMethods = {}; // empty method placeholders to fulfill required prop
    renderWithProviders(
      <TransporterTable
        setupSign={mockSetupSign}
        // @ts-ignore
        arrayFieldMethods={emptyArrayFieldMethods}
        transporters={TRAN_ARRAY}
      />,
      { preloadedState: { manifest: { readOnly: false } } }
    );
    const actionDropdowns = await screen.findAllByRole('button', {
      name: /transporter [0-9] actions/,
    });
    for (let i = 0; i < TRAN_ARRAY.length; i++) {
      await userEvent.click(actionDropdowns[i]);
      expect(screen.getByTitle(`move transporter ${i} down`)).not.toBeDisabled();
    }
  });
});
