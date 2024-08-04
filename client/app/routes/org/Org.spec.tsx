import { useSearchParams } from 'react-router-dom';
import { Org } from './Org';
import { afterAll, afterEach, beforeAll, describe, expect, it, Mock, vi } from 'vitest';
import { cleanup, renderWithProviders } from '~/mocks';
import { setupServer } from 'msw/node';
import { mockSiteEndpoints } from '~/mocks/handlers';
import { waitFor } from '@testing-library/react';

const server = setupServer(...mockSiteEndpoints);
afterEach(() => cleanup());
beforeAll(() => server.listen());
afterAll(() => server.close());

describe('Org', () => {
  vi.mock('react-router-dom', async (importOriginal) => ({
    ...(await importOriginal<typeof import('react-router-dom')>()),
    useSearchParams: vi.fn(),
  }));
  it('sets default org search param if not present', async () => {
    const setSearchParams = vi.fn();
    const searchParams = new URLSearchParams();
    (useSearchParams as Mock).mockReturnValue([searchParams, setSearchParams]);

    renderWithProviders(<Org />);

    await waitFor(() => expect(setSearchParams).toHaveBeenCalled(), { timeout: 400 });
  });

  it('does not change org search param if already present', () => {
    const setSearchParams = vi.fn();
    const searchParams = new URLSearchParams('org=existing');
    (useSearchParams as Mock).mockReturnValue([searchParams, setSearchParams]);

    renderWithProviders(<Org />);

    expect(setSearchParams).not.toHaveBeenCalled();
  });

  it('removes org search param if it does not match any existing org', async () => {
    const setSearchParams = vi.fn();
    const searchParams = new URLSearchParams('org=nonexistent');
    (useSearchParams as Mock).mockReturnValue([searchParams, setSearchParams]);

    renderWithProviders(<Org />);

    await waitFor(() => expect(setSearchParams).toHaveBeenCalled(), { timeout: 400 });
    expect(setSearchParams).toHaveBeenCalledWith(new URLSearchParams());
  });
});
