import { screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, renderWithProviders } from '~/mocks';
import { mockUserEndpoints, mockWasteEndpoints } from '~/mocks/handlers';
import { Profile } from './Profile';

const server = setupServer(...mockUserEndpoints, ...mockWasteEndpoints);
afterEach(() => cleanup());
beforeAll(() => server.listen());
afterAll(() => server.close());

describe('Profile', () => {
  it('renders loading spinner when data is loading', () => {
    renderWithProviders(<Profile />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders profile information when data is loaded', async () => {
    renderWithProviders(<Profile />);
    expect(await screen.findByText('Profile')).toBeInTheDocument();
    expect(await screen.findByText('User Information')).toBeInTheDocument();
    expect(await screen.findByText('RCRAInfo Profile')).toBeInTheDocument();
  });
});
