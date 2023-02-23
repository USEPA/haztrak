import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test';
import { HandlerType } from 'types/Handler/Handler';
import HandlerForm from './HandlerForm';

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

describe('HandlerForm', () => {
  test('renders with basic information inputs', () => {
    renderWithProviders(<HandlerForm handlerType={HandlerType.Generator} />);
    expect(screen.getByText(/Site Name/i)).toBeInTheDocument();
    expect(screen.getByText(`${HandlerType.Generator} ID`, { exact: false })).toBeInTheDocument();
  });
  test('initially includes 1 AddressForm for site address', async () => {
    renderWithProviders(<HandlerForm handlerType={HandlerType.Generator} />);
    expect(await screen.findAllByLabelText(/Street Number/i).then((v) => v.length)).toBe(1);
  });
  test('renders 2 AddressForms for site and mailing when checked', async () => {
    renderWithProviders(<HandlerForm handlerType={HandlerType.Generator} />);
    fireEvent.click(screen.getByLabelText(/Separate Mailing Address/i));
    expect(await screen.findAllByText(/Street Number/i).then((v) => v.length)).toBe(2);
  });
});
