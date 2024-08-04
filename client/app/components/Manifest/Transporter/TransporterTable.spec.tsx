import userEvent from '@testing-library/user-event';
import { Transporter } from '~/components/Manifest';
import { setupServer } from 'msw/node';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'app/mocks';
import { createMockTransporter } from '~/mocks/fixtures';
import { mockUserEndpoints } from 'app/mocks/handlers';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { TransporterTable } from './index';

const HANDLER_ID_1 = 'siteId1';
const HANDLER_ID_2 = 'siteId2';
const HANDLER_NAME_1 = 'My Transporter';
const HANDLER_NAME_2 = 'My Other Transporter';

const mockSetupSign = () => undefined;

const TRAN_ARRAY: Transporter[] = [
  {
    ...createMockTransporter({ epaSiteId: HANDLER_ID_1, name: HANDLER_NAME_1, order: 1 }),
  },
  {
    ...createMockTransporter({ epaSiteId: HANDLER_ID_2, name: HANDLER_NAME_2, order: 2 }),
  },
];
const server = setupServer(...mockUserEndpoints);
afterEach(() => cleanup());
beforeAll(() => server.listen());
afterAll(() => server.close());

describe('TransporterTable', () => {
  test('renders an array of transporter', () => {
    const emptyArrayFieldMethods = {}; // empty method placeholders to fulfil required prop
    renderWithProviders(
      <TransporterTable
        setupSign={mockSetupSign}
        // @ts-expect-error - we do not need to pass the arrayFieldMethods for this test
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
        // @ts-expect-error - we do not need to pass the arrayFieldMethods for this test
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
        // @ts-expect-error - we do not need to pass the arrayFieldMethods for this test
        arrayFieldMethods={emptyArrayFieldMethods}
        transporters={TRAN_ARRAY}
      />,
      { preloadedState: { manifest: { readOnly: true } } }
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
        // @ts-expect-error - we do not need to pass the arrayFieldMethods for this test
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
      expect(screen.getByTitle(`move transporter ${i + 1} up`)).not.toBeDisabled();
    }
  });
  test('All but last move-down buttons are not disabled', async () => {
    const emptyArrayFieldMethods = {}; // empty method placeholders to fulfill required prop
    renderWithProviders(
      <TransporterTable
        setupSign={mockSetupSign}
        // @ts-expect-error - we do not need to pass the arrayFieldMethods for this test
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
      expect(screen.getByTitle(`move transporter ${i + 1} down`)).not.toBeDisabled();
    }
  });
});
test('Expanding transporter opens one accordion only', async () => {
  const emptyArrayFieldMethods = {}; // empty method placeholders to fulfill required prop
  TRAN_ARRAY.push({
    ...createMockTransporter({ epaSiteId: HANDLER_ID_1, name: HANDLER_NAME_1, order: 3 }),
  });

  renderWithProviders(
    <TransporterTable
      setupSign={mockSetupSign}
      // @ts-expect-error - we do not need to pass the arrayFieldMethods for this test
      arrayFieldMethods={emptyArrayFieldMethods}
      transporters={TRAN_ARRAY}
    />,
    { preloadedState: { manifest: { readOnly: false } } }
  );
  const actionDropdown = await screen.findByRole('button', {
    name: /transporter 1 actions/,
  });
  await userEvent.click(actionDropdown);
  const detailButton = await screen.findByTitle('View transporter 1 details');
  await userEvent.click(detailButton);

  const accordion = document.querySelectorAll('.accordion-collapse.collapse.show');
  expect(accordion).toHaveLength(1);
  expect(accordion[0]).toBeInTheDocument();
});
