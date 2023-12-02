import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserInfoForm } from 'components/User/UserInfoForm';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { HaztrakUser, ProfileSlice } from 'store';
import { renderWithProviders, screen } from 'test-utils';
import { API_BASE_URL } from 'test-utils/mock/handlers';
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

const DEFAULT_USER: HaztrakUser = {
  username: 'test',
  firstName: 'David',
  lastName: 'smith',
  email: 'test@mail.com',
};

const server = setupServer(
  http.put(`${API_BASE_URL}/api/user`, (info) => {
    const user: HaztrakUser = { ...DEFAULT_USER };
    return HttpResponse.json({ ...user, ...info.request.body });
  })
);

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
    const user: HaztrakUser = {
      ...DEFAULT_USER,
      username: 'test',
      firstName: 'David',
    };
    const profile: ProfileSlice = {
      user: 'test',
    };
    renderWithProviders(<UserInfoForm user={user} profile={profile} />, {});
    expect(screen.getByRole('textbox', { name: 'First Name' })).toHaveValue(user.firstName);
    expect(screen.getByText(user.username)).toBeInTheDocument();
  });
  test('update profile fields', async () => {
    // Arrange
    const newEmail = 'newMockEmail@mail.com';
    const user: HaztrakUser = {
      ...DEFAULT_USER,
    };
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
