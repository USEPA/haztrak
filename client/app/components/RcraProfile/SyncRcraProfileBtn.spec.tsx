import { screen } from '@testing-library/react';
import { SyncRcrainfoProfileBtn } from '~/components/RcraProfile/SyncRcrainfoProfileBtn';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, renderWithProviders } from '~/mocks';
import { setupServer } from 'msw/node';
import { mockUserEndpoints } from '~/mocks/handlers';

const server = setupServer(...mockUserEndpoints);
afterEach(() => cleanup());
beforeAll(() => server.listen());
afterAll(() => server.close());

describe('SyncRcrainfoProfileBtn', () => {
  it('renders the button with correct text', () => {
    renderWithProviders(<SyncRcrainfoProfileBtn setTaskId={vi.fn()} />);
    expect(screen.getByText('Sync Site Permissions')).toBeInTheDocument();
  });
});
