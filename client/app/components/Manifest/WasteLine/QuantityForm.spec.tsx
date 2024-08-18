import { QuantityForm } from '~/components/Manifest/WasteLine/QuantityForm';

import { cleanup, renderWithProviders, screen } from '~/mocks';
import { afterEach, describe, expect, test } from 'vitest';

afterEach(() => cleanup());

describe('QuantityForm', () => {
  test('renders', () => {
    renderWithProviders(<QuantityForm />);
    expect(screen.getByText(/Container/i)).toBeInTheDocument();
  });
});
