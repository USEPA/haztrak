import { useOrg } from './useOrg';
import { useSearchParams } from 'react-router';
import { afterAll, afterEach, beforeAll, describe, expect, it, Mock, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { mockSiteEndpoints } from '~/mocks/handlers';
import { cleanup, renderHookWithProviders as renderHook } from '~/mocks';
import { act } from '@testing-library/react';

const server = setupServer(...mockSiteEndpoints);
afterEach(() => cleanup());
beforeAll(() => server.listen());
afterAll(() => server.close());

describe('useOrg Hook', () => {
  vi.mock('react-router-dom', async (importOriginal) => ({
    ...(await importOriginal<typeof import('react-router-dom')>()),
    useSearchParams: vi.fn(),
  }));
  it('returns the initial orgId from search params', async () => {
    const setSearchParams = vi.fn();
    const searchParams = new URLSearchParams('org=myOrg');
    (useSearchParams as Mock).mockReturnValue([searchParams, setSearchParams]);

    const { result } = renderHook(() => useOrg());

    expect(result.current.orgId).toBe('myOrg');
  });

  it('sets the orgId state and updates search params', () => {
    const setSearchParams = vi.fn();
    const searchParams = new URLSearchParams();
    (useSearchParams as Mock).mockReturnValue([searchParams, setSearchParams]);

    const { result } = renderHook(() => useOrg());

    act(() => {
      result.current.setOrgId('new-org');
    });

    expect(result.current.orgId).toBe('new-org');
    expect(setSearchParams).toHaveBeenCalledWith(new URLSearchParams('org=new-org'));
  });
});
