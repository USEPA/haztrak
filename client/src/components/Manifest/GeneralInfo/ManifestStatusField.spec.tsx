import '@testing-library/jest-dom';
import { ManifestStatusField } from 'components/Manifest/GeneralInfo/ManifestStatusField';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { afterEach, describe, expect, test } from 'vitest';
import { Manifest } from 'components/Manifest/manifestSchema';
import { useFormContext } from 'react-hook-form';

afterEach(() => {
  cleanup();
});

interface TestComponentProps {
  isDraft?: boolean;
  setManifestStatus?: (status: string | undefined) => void;
  readOnly?: boolean;
}

const TestComponent = ({ isDraft, setManifestStatus, readOnly }: TestComponentProps) => {
  const setStatusFn = setManifestStatus ? setManifestStatus : () => undefined;
  const isDraftVal = isDraft !== undefined ? isDraft : true;
  const readOnlyVal = readOnly !== undefined ? readOnly : false;
  return (
    <>
      <ManifestStatusField
        isDraft={isDraftVal}
        setManifestStatus={setStatusFn}
        readOnly={readOnlyVal}
      />
    </>
  );
};

describe('Manifest Status Field', () => {
  test('renders', () => {
    renderWithProviders(
      <ManifestStatusField isDraft={true} setManifestStatus={() => undefined} readOnly={false} />
    );
  });
  test('is not editable if read only', () => {
    renderWithProviders(
      <ManifestStatusField isDraft={true} setManifestStatus={() => undefined} readOnly={true} />
    );
    expect(screen.getByLabelText(/Status/i)).toBeDisabled();
  });
  test('is editable if the manifest is a draft', () => {
    renderWithProviders(
      <ManifestStatusField isDraft={true} setManifestStatus={() => undefined} readOnly={false} />
    );
    expect(screen.getByLabelText(/Status/i)).not.toBeDisabled();
  });
  test('new manifest are draft by default', async () => {
    renderWithProviders(<TestComponent />);
    const combobox = screen.getByRole('combobox');
    expect(combobox).toHaveValue('NotAssigned');
    expect(combobox).toBeEnabled();
  });
});
