import { afterEach, describe, expect, test } from 'vitest';

import { cleanup, renderWithProviders, screen } from '~/mocks';
import { Sidebar } from './Sidebar';

afterEach(() => {
  cleanup();
});

describe('Sidebar', () => {
  test('returns nothing when user not logged in', () => {
    const userName = 'testuser1';
    renderWithProviders(<Sidebar />);
    expect(screen.queryByText(userName)).not.toBeInTheDocument();
  });
});
