import { renderWithProviders, screen } from '~/mocks';

import { describe, expect, test } from 'vitest';
import { Login } from '~/features/login';

describe('Login component', () => {
  test('renders', () => {
    renderWithProviders(<Login />, {});
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });
});
