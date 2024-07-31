import '@testing-library/jest-dom';
import { PhoneForm } from 'components/Manifest/Contact';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { afterEach, describe, expect, test } from 'vitest';

afterEach(() => {
  cleanup();
});

describe('PhoneForm', () => {
  test('renders', () => {
    renderWithProviders(<PhoneForm handlerType={'generator'} />);
    expect(screen.getByText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByText(/Extension/i)).toBeInTheDocument();
  });
});
