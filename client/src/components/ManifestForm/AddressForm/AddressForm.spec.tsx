import '@testing-library/jest-dom';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test';
import { AddressType, HandlerType } from 'types/Handler/Handler';
import { AddressForm } from './AddressForm';

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

describe('AddressForm', () => {
  test('renders with basic information inputs', () => {
    renderWithProviders(
      <AddressForm addressType={AddressType.site} handlerType={HandlerType.Generator} />
    );
    expect(screen.getByText(/Street Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Street Number/i)).toBeInTheDocument();
    expect(screen.getByText(/Zip/i)).toBeInTheDocument();
    expect(screen.getByText(/City/i)).toBeInTheDocument();
  });
});
