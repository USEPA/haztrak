import '@testing-library/jest-dom';
import { ManifestStatusField } from 'components/Manifest/GeneralInfo/ManifestStatusField';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { afterEach, describe, expect, test } from 'vitest';

afterEach(() => {
  cleanup();
});

interface TestComponentProps {
  isDraft?: boolean;
  readOnly?: boolean;
}

const TestComponent = ({ isDraft, readOnly }: TestComponentProps) => {
  const isDraftVal = isDraft !== undefined ? isDraft : true;
  const readOnlyVal = readOnly !== undefined ? readOnly : false;
  return (
    <>
      <ManifestStatusField isDraft={isDraftVal} readOnly={readOnlyVal} />
    </>
  );
};

describe('Manifest Status Field', () => {
  test('renders', () => {
    renderWithProviders(<ManifestStatusField isDraft={true} readOnly={false} />);
  });
  test('is not editable if read only', () => {
    renderWithProviders(<ManifestStatusField isDraft={true} readOnly={true} />);
    expect(screen.getByLabelText(/Status/i)).toBeDisabled();
  });
  test('is editable if the manifest is a draft', () => {
    renderWithProviders(<ManifestStatusField isDraft={true} readOnly={false} />);
    expect(screen.getByLabelText(/Status/i)).not.toBeDisabled();
  });
});
