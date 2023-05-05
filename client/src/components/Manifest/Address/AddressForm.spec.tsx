import '@testing-library/jest-dom';
import { siteType } from 'components/Manifest/manifestSchema';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { AddressForm } from './AddressForm';

afterEach(() => {
  cleanup();
});

describe('AddressForm', () => {
  test('renders with basic information inputs', () => {
    renderWithProviders(
      <AddressForm addressType={'siteAddress'} handlerType={siteType.enum.generator} />
    );
    expect(screen.getByText(/Street Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Street Number/i)).toBeInTheDocument();
    expect(screen.getByText(/Zip/i)).toBeInTheDocument();
    expect(screen.getByText(/City/i)).toBeInTheDocument();
  });
});
