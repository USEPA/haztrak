import React from 'react';
import { render, screen } from 'utils';
import Login from './index';

describe('Login Component', () => {
  test('renders', () => {
    render(<Login />, null);
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });
});
