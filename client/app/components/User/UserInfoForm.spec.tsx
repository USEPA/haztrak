import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserInfoForm } from '~/components/User/UserInfoForm';
import { setupServer } from 'msw/node';
import React from 'react';
import { HaztrakUser, ProfileSlice } from '~/store';
import { renderWithProviders, screen } from 'app/mocks';
import { createMockHaztrakUser } from '~/mocks/fixtures';
import { mockUserEndpoints } from 'app/mocks/api';
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

const server = setupServer(...mockUserEndpoints);

// pre-/post-test hooks
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup();
  vi.resetAllMocks();
});
afterAll(() => server.close()); // Disable API mocking after the tests are done.

describe('UserProfile', () => {
  test('renders', () => {
    const myUsername = 'myUsername';
    const user: HaztrakUser = createMockHaztrakUser({ username: myUsername, firstName: 'David' });
    const profile: ProfileSlice = {
      user: myUsername,
    };
    renderWithProviders(<UserInfoForm user={user} profile={profile} />, {});
    expect(screen.getByRole('textbox', { name: 'First Name' })).toHaveValue(user.firstName);
    expect(screen.getByText(user.username)).toBeInTheDocument();
  });
  test('update profile fields', async () => {
    // Arrange
    const newEmail = 'newMockEmail@mail.com';
    const user: HaztrakUser = createMockHaztrakUser({ email: 'oldEmail@gmail.com' });
    const profile: ProfileSlice = {
      user: 'test',
    };
    renderWithProviders(<UserInfoForm user={user} profile={profile} />, {});
    const editButton = screen.getByRole('button', { name: 'Edit' });
    const emailTextBox = screen.getByRole('textbox', { name: 'Email' });
    // Act
    await userEvent.click(editButton);
    await userEvent.clear(emailTextBox);
    await userEvent.type(emailTextBox, newEmail);
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await userEvent.click(saveButton);
    // Assert
    expect(await screen.findByRole('textbox', { name: 'Email' })).toHaveValue(newEmail);
  });
});
