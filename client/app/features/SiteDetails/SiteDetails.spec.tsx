import { screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { SiteDetails } from './SiteDetails';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { mockSiteEndpoints } from '~/mocks/handlers';
import { renderWithProviders } from '~/mocks';

const server = setupServer(...mockSiteEndpoints);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => vi.fn(),
  useParams: () => ({ siteId: 'test-site' }),
}));

describe('SiteDetails', () => {
  it('renders loading spinner when data is loading', () => {
    renderWithProviders(<SiteDetails />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders site details when data is available', async () => {
    renderWithProviders(<SiteDetails />);

    await waitFor(() => expect(screen.getByTestId(/spinner/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByTestId(/spinner/i)).not.toBeInTheDocument());

    expect(screen.getAllByText('test-site')[0]).toBeInTheDocument();
  });
});
