import '@testing-library/jest-dom';
import React from 'react';
import { renderWithProviders, screen } from 'test-utils';
import { Login } from 'features/Login';
import { describe, test, expect } from 'vitest';

describe('Login component', () => {
  test('renders', () => {
    renderWithProviders(<Login />, {});
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });
});
