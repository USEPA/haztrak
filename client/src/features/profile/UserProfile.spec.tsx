import { UserProfile } from 'features/profile/UserProfile';
import React from 'react';
import { HaztrakUser } from 'store/userSlice/user.slice';
import { renderWithProviders, screen } from 'test-utils';

describe('UserProfile', () => {
  test('renders', () => {
    const user: HaztrakUser = {
      username: 'test',
      firstName: 'David',
      lastName: 'smith',
      email: 'test@mail.com',
    };
    renderWithProviders(<UserProfile user={user} />, {});
    expect(screen.getByRole('textbox', { name: 'First Name' })).toHaveValue(user.firstName);
    expect(screen.getByText(user.username)).toBeInTheDocument();
  });
});
