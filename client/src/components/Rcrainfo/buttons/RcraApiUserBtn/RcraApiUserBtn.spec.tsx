import { RcraApiUserBtn } from '~/components/Rcrainfo/buttons/RcraApiUserBtn/RcraApiUserBtn';

import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, renderWithProviders, screen } from '~/mocks';

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe('RcraApiUserBtn', () => {
  test('renders', () => {
    renderWithProviders(<RcraApiUserBtn>Click Me</RcraApiUserBtn>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  test('disabled by default', () => {
    renderWithProviders(<RcraApiUserBtn>Click Me</RcraApiUserBtn>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
  test('is disabled when disabled prop', () => {
    renderWithProviders(<RcraApiUserBtn disabled={true}>Click Me</RcraApiUserBtn>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
  test('is disabled when apiUser=false', () => {
    renderWithProviders(<RcraApiUserBtn>Click Me</RcraApiUserBtn>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
