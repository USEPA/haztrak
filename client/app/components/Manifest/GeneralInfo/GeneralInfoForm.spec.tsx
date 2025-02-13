import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, renderWithProviders, screen } from '~/mocks';
import { GeneralInfoForm } from './GeneralInfoForm';

afterEach(() => {
  cleanup();
});

describe('Manifest General Info Form', () => {
  test('renders', () => {
    renderWithProviders(<GeneralInfoForm isDraft={true} />);
  });
  test('is editable if not readOnly', () => {
    renderWithProviders(<GeneralInfoForm isDraft={true} />, {
      preloadedState: { manifest: { readOnly: false } },
    });
    expect(screen.getByLabelText(/Potential Ship Date/i)).toBeEnabled();
  });
});
