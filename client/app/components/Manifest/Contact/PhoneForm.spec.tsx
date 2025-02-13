import { PhoneForm } from '~/components/Manifest/Contact';

import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, renderWithProviders, screen } from '~/mocks';

afterEach(() => {
  cleanup();
});

describe('PhoneForm', () => {
  test('renders', () => {
    renderWithProviders(<PhoneForm handlerType={'generator'} />);
    expect(screen.getByText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByText(/Extension/i)).toBeInTheDocument();
  });
});
