import '@testing-library/jest-dom';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test';
import ContactForm from './ContactForm';

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

describe('ContactForm', () => {
  test('renders with basic information inputs', () => {
    renderWithProviders(<ContactForm handlerFormType={'generator'} />);
    expect(screen.getByText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Last Name/i)).toBeInTheDocument();
  });
});
