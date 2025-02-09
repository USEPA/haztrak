import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '~/mocks';
import { ErrorPage } from './ErrorPage';

vi.mock('react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router')>()),
  useNavigate: vi.fn(),
}));

describe('ErrorPage', () => {
  it('renders 404 error message when code is 404', () => {
    renderWithProviders(<ErrorPage code={404} />);
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });

  it('renders default error message when code is undefined', () => {
    renderWithProviders(<ErrorPage />);
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });
});
