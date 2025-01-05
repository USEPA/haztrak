import { screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '~/mocks';
import { mockSiteEndpoints } from '~/mocks/handlers';
import { SiteDetails } from './SiteDetails';

const server = setupServer(...mockSiteEndpoints);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router')>()),
  useNavigate: () => vi.fn(),
  useParams: () => ({ siteId: 'test-site' }),
}));

describe('SiteDetails', () => {
  it('renders loading spinner when data is loading', () => {
    renderWithProviders(<SiteDetails />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
