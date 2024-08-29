import { render, screen } from '@testing-library/react';
import { AvatarForm } from './AvatarForm';
import { describe, expect, it } from 'vitest';

describe('AvatarForm Component', () => {
  it('avatar image is a button', () => {
    render(<AvatarForm />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
