import '@testing-library/jest-dom';
import { ManifestFABs } from 'components/Manifest/Actions/ManifestFABs';
import { ManifestContext } from 'components/Manifest/ManifestForm';
import { ManifestStatus } from 'components/Manifest/manifestSchema';
import { useReadOnly } from 'hooks/manifest';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { afterEach, describe, expect, test } from 'vitest';

const TestComponent = ({
  status,
  signAble,
  readOnly,
}: {
  status: ManifestStatus;
  signAble: boolean;
  readOnly: boolean;
}) => {
  useReadOnly(readOnly);
  return (
    // @ts-ignore
    <ManifestContext.Provider value={{ status, signAble }}>
      <ManifestFABs onSignClick={() => undefined} />
    </ManifestContext.Provider>
  );
};

afterEach(() => {
  cleanup();
});

describe('ManifestActionBtns', () => {
  test.each<[status: ManifestStatus, signAble: boolean]>([
    ['Scheduled', true],
    ['Scheduled', false],
    ['NotAssigned', false],
    ['NotAssigned', true],
  ])('renders a save button when editing and {status: "%s", signAble: %s}', (status, signAble) => {
    renderWithProviders(<TestComponent status={status} signAble={signAble} readOnly={false} />);
    expect(screen.queryByRole('button', { name: /Save/i })).toBeInTheDocument();
  });
  test.each<[readonly: boolean, signAble: boolean]>([[true, false]])(
    'renders a edit button when {readOnly: %s, signAble: %s}',
    (readOnly, signAble) => {
      renderWithProviders(
        <TestComponent readOnly={readOnly} status="Scheduled" signAble={signAble} />
      );
      expect(screen.queryByRole('button', { name: /Edit/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Sign/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Save/i })).not.toBeInTheDocument();
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
        <TestComponent readOnly={readOnly} status="NotAssigned" signAble={signAble} />
      );
      expect(screen.queryByRole('button', { name: /Sign/i })).not.toBeInTheDocument();
    }
  );
});
