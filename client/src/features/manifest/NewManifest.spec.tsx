import '@testing-library/jest-dom';
import { NewManifest } from 'features/manifest/NewManifest';
import React from 'react';
import { renderWithProviders, screen } from 'test-utils';
import { describe, expect, test } from 'vitest';

describe('NewManifest', () => {
  test('renders', () => {
    renderWithProviders(<NewManifest />, {});
    expect(screen.getByRole('combobox', { name: /site Role/i })).toBeInTheDocument();
  });
  test('site type select is initially disabled', () => {
    renderWithProviders(<NewManifest />, {});
    const siteRole = screen.getByRole('combobox', { name: /site Role/i });
    expect(siteRole).toBeDisabled();
  });
});
