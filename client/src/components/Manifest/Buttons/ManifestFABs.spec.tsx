import '@testing-library/jest-dom';
import { ManifestFABs } from 'components/Manifest/Buttons/ManifestFABs';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { afterEach, describe, expect, test } from 'vitest';

afterEach(() => {
  cleanup();
});

describe('ManifestActionBtns', () => {
  test.each([
    ['Scheduled', true],
    ['Scheduled', false],
    ['NotAssigned', false],
    ['NotAssigned', true],
  ])('renders a save button when editing and {status: "%s", signAble: %s}', (status, signAble) => {
    renderWithProviders(
      // @ts-ignore - Status is expected to be a ManifestStatus, but we're passing a string
      <ManifestFABs readOnly={false} manifestStatus={status} signAble={signAble} />
    );
    expect(screen.queryByRole('button', { name: /Save/i })).toBeInTheDocument();
  });
  test.each([[true, false]])(
    'renders a edit button when {readOnly: %s, signAble: %s}',
    (readOnly, signAble) => {
      renderWithProviders(
        // @ts-ignore - Status is expected to be a ManifestStatus, but we're passing a string
        <ManifestFABs readOnly={readOnly} manifestStatus={'Scheduled'} signAble={signAble} />
      );
      expect(screen.queryByRole('button', { name: /Edit/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Sign/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Save/i })).not.toBeInTheDocument();
    }
  );
  test.each([[true, true]])(
    'renders a sign button when {readOnly: %s, signAble: %s}',
    (readOnly, signAble) => {
      renderWithProviders(
        // @ts-ignore - Status is expected to be a ManifestStatus, but we're passing a string
        <ManifestFABs readOnly={readOnly} manifestStatus={'Scheduled'} signAble={signAble} />
      );
      expect(screen.queryByRole('button', { name: /Sign/i })).toBeInTheDocument();
    }
  );
  test.each([
    [true, true],
    [true, false],
    [false, false],
    [false, true],
  ])(
    'never renders a sign button when draft status with {readOnly: %s, signAble: %s}',
    (readOnly, signAble) => {
      renderWithProviders(
        // @ts-ignore - Status is expected to be a ManifestStatus, but we're passing a string
        <ManifestFABs readOnly={readOnly} manifestStatus={'NotAssigned'} signAble={signAble} />
      );
      expect(screen.queryByRole('button', { name: /Sign/i })).not.toBeInTheDocument();
    }
  );
});
