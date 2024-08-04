import { QuantityForm } from '~/components/Manifest/WasteLine/QuantityForm';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'app/mocks';
import { afterEach, describe, expect, test } from 'vitest';

afterEach(() => cleanup());

describe('QuantityForm', () => {
  test('renders', () => {
    renderWithProviders(<QuantityForm />);
    expect(screen.getByText(/Container/i)).toBeInTheDocument();
  });
});
