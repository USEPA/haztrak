import React from 'react';
import { renderWithProviders, screen } from 'app/mocks';
import { Login } from 'app/routes/login';
import { describe, expect, test } from 'vitest';

describe('Login component', () => {
  test('renders', () => {
    renderWithProviders(<Login />, {});
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });
});
