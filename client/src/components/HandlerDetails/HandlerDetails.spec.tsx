import '@testing-library/jest-dom';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test';
import { MOCK_HANDLER } from 'test/fixtures';
import { ManifestHandler } from 'types/Handler';
import HandlerDetails from './HandlerDetails';

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

describe('HandlerDetails', () => {
  test('displays the handlers information', () => {
    renderWithProviders(<HandlerDetails handler={MOCK_HANDLER} />);
    expect(screen.getByText(MOCK_HANDLER.name)).toBeInTheDocument();
    expect(screen.getByText(MOCK_HANDLER.epaSiteId)).toBeInTheDocument();
  });
  test('does not display undefined when part of address is missing', () => {
    const minimumAddressHandler: ManifestHandler = {
      ...MOCK_HANDLER,
      siteAddress: {
        address1: '123 main st.',
        state: { code: 'Tx' },
      },
    };
    renderWithProviders(<HandlerDetails handler={minimumAddressHandler} />);
    expect(screen.queryByText(/undefined/)).not.toBeInTheDocument();
  });
});
