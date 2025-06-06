import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { useAuth } from '~/hooks';
import { renderWithProviders } from '~/mocks';
import { PrivateRoute } from './PrivateRoute';

vi.mock('~/hooks');

describe('PrivateRoute Component', () => {
  it('renders Outlet when user is authenticated', () => {
    // @ts-expect-error - Just mocking the minimal required properties
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true });
    renderWithProviders(
      <Routes>
        <Route path="/private" element={<PrivateRoute />}>
          <Route path="" element={<div>Private Content</div>} />
        </Route>
        <Route path="/login" element={<div>login</div>} />
      </Routes>,
      { routerProps: { initialEntries: ['/private'] } }
    );
    expect(screen.getByText('Private Content')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    // @ts-expect-error - Just mocking the minimal required properties
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false });
    renderWithProviders(
      <Routes>
        <Route path="/" element={<div>home</div>} />
        <Route path="/private" element={<PrivateRoute />} />
        <Route path="/login" element={<div>Login</div>} />
      </Routes>,
      { routerProps: { initialEntries: ['/private'] } }
    );
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it('preserves the location state when redirecting to login', () => {
    // @ts-expect-error - Just mocking the minimal required properties
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true });
    renderWithProviders(
      <Routes>
        <Route path="/private" element={<PrivateRoute />}>
          <Route path="content" element={<div>Private Content</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>,
      { routerProps: { initialEntries: ['/private/content'] } }
    );
    expect(screen.getByText(/private content/i)).toBeInTheDocument();
  });
});
