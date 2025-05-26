import { QuantityForm } from '~/components/Manifest/WasteLine/QuantityForm';

import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, renderWithProviders, screen } from '~/mocks';

afterEach(() => cleanup());

describe('QuantityForm', () => {
  test('renders', () => {
    renderWithProviders(<QuantityForm />);
    expect(screen.getByText(/Container/i)).toBeInTheDocument();
  });
});
