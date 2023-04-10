import '@testing-library/jest-dom';
import { HandlerType } from 'components/ManifestForm/manifestSchema';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { AddressForm } from './AddressForm';

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

describe('AddressForm', () => {
  test('renders with basic information inputs', () => {
    renderWithProviders(
      <AddressForm addressType={'siteAddress'} handlerType={HandlerType.enum.generator} />
    );
    expect(screen.getByText(/Street Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Street Number/i)).toBeInTheDocument();
    expect(screen.getByText(/Zip/i)).toBeInTheDocument();
    expect(screen.getByText(/City/i)).toBeInTheDocument();
  });
});
