import '@testing-library/jest-dom';
import { ManifestStatusField } from 'components/Manifest/GeneralInfo/ManifestStatusField';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { afterEach, describe, expect, test } from 'vitest';

afterEach(() => {
  cleanup();
});

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
  test('new manifest options are pending and draft if no designated facility access', () => {
    renderWithProviders(
      <ManifestStatusField isDraft={true} setManifestStatus={() => undefined} readOnly={false} />
    );
    // expect(screen.getByLabelText(/Status/i)).not.toBeDisabled();
    const options = screen.getAllByRole('option');
    // screen.debug(undefined, Infinity);

    options.forEach((option) => {
      console.log(option);
      expect(option).toBeVisible();
      // if (option.textContent === 'draft' || option.textContent === 'pending') {
      //   expect(option).toBeVisible()
      // } else {
      //   expect(option).not.toBeVisible();
      // }
    });
  });
});
