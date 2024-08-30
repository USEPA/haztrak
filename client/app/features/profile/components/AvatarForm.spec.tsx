import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AvatarForm } from './AvatarForm';

describe('AvatarForm Component', () => {
  it('avatar image is a button', () => {
    render(<AvatarForm />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
