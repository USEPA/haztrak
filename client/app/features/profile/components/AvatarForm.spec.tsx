import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '~/mocks';
import { AvatarForm } from './AvatarForm';

describe('AvatarForm Component', () => {
  it('avatar image is a button', () => {
    renderWithProviders(<AvatarForm />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
