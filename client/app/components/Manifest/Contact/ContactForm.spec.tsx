import '@testing-library/jest-dom';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'app/mocks';
import { ContactForm } from './ContactForm';
import { afterEach, describe, test, expect } from 'vitest';

afterEach(() => {
  cleanup();
});

describe('ContactForm', () => {
  test('renders with basic information inputs', () => {
    renderWithProviders(<ContactForm handlerType={'generator'} />);
    expect(screen.getByText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Last Name/i)).toBeInTheDocument();
  });
});
