import { fireEvent, screen } from '@testing-library/react';
import { RcraProfile } from './RcraProfile';
import { RcrainfoProfileState } from '~/store';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, renderWithProviders } from '~/mocks';
import { setupServer } from 'msw/node';
import { mockUserEndpoints } from '~/mocks/handlers';

const mockProfile: RcrainfoProfileState = {
  user: 'testUser',
  rcraUsername: 'testUsername',
  rcraAPIID: 'testAPIID',
  rcraAPIKey: 'testAPIKey',
  rcraSites: {
    site1: {
      epaSiteId: 'site1',
      permissions: {
        eManifest: 'Yes',
        biennialReport: 'Yes',
        annualReport: 'Yes',
        WIETS: 'Yes',
        myRCRAid: 'Yes',
        siteManagement: false,
      },
    },
  },
  isLoading: false,
};

const server = setupServer(...mockUserEndpoints);
afterEach(() => cleanup());
beforeAll(() => server.listen());
afterAll(() => server.close());

describe('RcraProfile Component', () => {
  it('renders profile data correctly', () => {
    renderWithProviders(<RcraProfile profile={mockProfile} />);

    expect(screen.getByPlaceholderText('testUsername')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('testAPIID')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('●●●●●●●●●●●')).toBeInTheDocument();
  });

  it('toggles edit mode correctly', () => {
    renderWithProviders(<RcraProfile profile={mockProfile} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeEnabled();
  });

  it('displays loading spinner when profile is loading', () => {
    renderWithProviders(<RcraProfile profile={{ ...mockProfile, isLoading: true }} />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
