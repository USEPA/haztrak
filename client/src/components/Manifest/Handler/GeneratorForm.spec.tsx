import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import { GeneratorForm } from 'components/Manifest/Handler/GeneratorForm';
import { siteType } from 'components/Manifest/manifestSchema';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { afterEach, describe, expect, test } from 'vitest';

afterEach(() => {
  cleanup();
});

describe('HandlerForm', () => {
  test('renders with basic information inputs', () => {
    renderWithProviders(<GeneratorForm />);
    expect(screen.getByText(/Site Name/i)).toBeInTheDocument();
    expect(screen.getByText(`${siteType.enum.generator} ID`, { exact: false })).toBeInTheDocument();
  });
  test('initially includes 1 AddressForm for site address', async () => {
    renderWithProviders(<GeneratorForm />);
    expect(await screen.findAllByLabelText(/Street Number/i).then((v) => v.length)).toBe(1);
  });
  test('renders 2 AddressForms for site and mailing when checked', async () => {
    renderWithProviders(<GeneratorForm />);
    fireEvent.click(screen.getByLabelText(/Separate Mailing Address/i));
    expect(await screen.findAllByText(/Street Number/i).then((v) => v.length)).toBe(2);
  });
});
