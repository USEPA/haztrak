import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProfile } from 'components/UserProfile/UserProfile';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { HaztrakUser } from 'store/authSlice/auth.slice';
import { renderWithProviders, screen } from 'test-utils';
import { API_BASE_URL } from 'test-utils/mock/handlers';
import { vi, beforeAll, afterAll, afterEach, describe, test, expect } from 'vitest';

const DEFAULT_USER: HaztrakUser = {
  username: 'test',
  firstName: 'David',
  lastName: 'smith',
  email: 'test@mail.com',
};

const server = setupServer(
  rest.put(`${API_BASE_URL}/api/user`, (req, res, ctx) => {
    const user: HaztrakUser = { ...DEFAULT_USER };
    // @ts-ignore
    return res(ctx.status(200), ctx.json({ ...user, ...req.body }));
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
    renderWithProviders(<UserProfile user={user} />, {});
    expect(screen.getByRole('textbox', { name: 'First Name' })).toHaveValue(user.firstName);
    expect(screen.getByText(user.username)).toBeInTheDocument();
  });
  test('update profile fields', async () => {
    // Arrange
    const newEmail = 'newMockEmail@mail.com';
    const user: HaztrakUser = {
      ...DEFAULT_USER,
    };
    renderWithProviders(<UserProfile user={user} />, {});
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
