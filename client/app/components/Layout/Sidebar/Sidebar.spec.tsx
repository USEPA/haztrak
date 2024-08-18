import { Sidebar } from '~/components/Layout/Sidebar/Sidebar';

import { cleanup, renderWithProviders, screen } from '~/mocks';
import { afterEach, describe, expect, test } from 'vitest';

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
