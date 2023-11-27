import '@testing-library/jest-dom';
import { Sidebar } from 'components/Layout';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { afterEach, describe, expect, test } from 'vitest';

afterEach(() => {
  cleanup();
});

describe('Sidebar', () => {
  test('returns nothing when user not logged in', () => {
    const userName = 'testuser1';
    renderWithProviders(<Sidebar show={true} onHide={() => undefined} />);
    expect(screen.queryByText(userName)).not.toBeInTheDocument();
  });
});
