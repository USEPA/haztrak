import { render } from '@testing-library/react';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import { Org } from './Org';
import { describe, expect, it, Mock, vi } from 'vitest';

describe('Org', () => {
  vi.mock('react-router-dom', async (importOriginal) => ({
    ...(await importOriginal<typeof import('react-router-dom')>()),
    useSearchParams: vi.fn(),
  }));
  it('sets default org search param if not present', () => {
    const setSearchParams = vi.fn();
    const searchParams = new URLSearchParams();
    (useSearchParams as Mock).mockReturnValue([searchParams, setSearchParams]);

    render(
      <MemoryRouter>
        <Org />
      </MemoryRouter>
    );

    expect(setSearchParams).toHaveBeenCalled();
  });

  it('does not change org search param if already present', () => {
    const setSearchParams = vi.fn();
    const searchParams = new URLSearchParams('org=existing');
    (useSearchParams as Mock).mockReturnValue([searchParams, setSearchParams]);

    render(
      <MemoryRouter>
        <Org />
      </MemoryRouter>
    );

    expect(setSearchParams).not.toHaveBeenCalled();
  });
});
