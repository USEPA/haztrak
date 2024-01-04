import '@testing-library/jest-dom';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { afterEach, describe, expect, test } from 'vitest';
import { GeneralInfoForm } from './GeneralInfoForm';

afterEach(() => {
  cleanup();
});

describe('Manifest General Info Form', () => {
  test('renders', () => {
    renderWithProviders(
      <GeneralInfoForm isDraft={true} setManifestStatus={() => undefined} readOnly={false} />
    );
  });
  test('is editable if not readOnly', () => {
    renderWithProviders(
      <GeneralInfoForm isDraft={true} setManifestStatus={() => undefined} readOnly={false} />
    );
    expect(screen.getByLabelText(/Potential Ship Date/i)).toBeEnabled();
  });
});
