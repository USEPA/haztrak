import '@testing-library/jest-dom';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { createMockHandler } from 'test-utils/fixtures';
import HandlerDetails from './HandlerDetails';

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

describe('HandlerDetails', () => {
  test('displays the handlers information', () => {
    const handler = createMockHandler();
    renderWithProviders(<HandlerDetails handler={handler} />);
    expect(screen.getByText(handler.name)).toBeInTheDocument();
    expect(screen.getByText(handler.epaSiteId)).toBeInTheDocument();
  });
  test('does not display undefined when part of address is missing', () => {
    const minimumAddressHandler = createMockHandler({
      siteAddress: {
        address1: '123 main st.',
        state: { code: 'Tx' },
      },
    });
    renderWithProviders(<HandlerDetails handler={minimumAddressHandler} />);
    expect(screen.queryByText(/undefined/)).not.toBeInTheDocument();
  });
});
