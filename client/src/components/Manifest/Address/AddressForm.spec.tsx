import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, renderWithProviders, screen } from '~/mocks';
import { AddressForm } from './AddressForm';

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
