import { cleanup, renderWithProviders, screen } from '~/mocks';
import { AddressForm } from './AddressForm';
import { afterEach, describe, test, expect } from 'vitest';

afterEach(() => {
  cleanup();
});

describe('AddressForm', () => {
  test('renders with basic information inputs', () => {
    renderWithProviders(<AddressForm addressType={'siteAddress'} />);
    expect(screen.getByText(/Street Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Street Number/i)).toBeInTheDocument();
    expect(screen.getByText(/Zip/i)).toBeInTheDocument();
    expect(screen.getByText(/City/i)).toBeInTheDocument();
  });
});
