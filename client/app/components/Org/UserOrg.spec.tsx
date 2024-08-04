import { screen } from '@testing-library/react';
import { UserOrg } from '~/components/Org/UserOrg';
import { ProfileSlice } from '~/store';
import { v4 as uuidv4 } from 'uuid';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '~/mocks';

const mockProfileWithOrg: ProfileSlice = {
  org: {
    name: 'Test Organization',
    rcrainfoIntegrated: true,
    slug: 'test-organization',
    id: uuidv4(),
  },
  sites: {},
  user: 'testuser1',
};

const mockProfileWithoutOrg: ProfileSlice = {
  org: null,
  sites: {},
  user: 'testuser1',
};

const mockProfileWithNonIntegratedOrg: ProfileSlice = {
  org: {
    name: 'Test Organization',
    rcrainfoIntegrated: false,
    slug: 'test-organization',
    id: uuidv4(),
  },
  sites: {},
  user: 'testuser1',
};

describe('UserOrg Component', () => {
  it('renders nothing when profile has no org', () => {
    renderWithProviders(<UserOrg profile={mockProfileWithoutOrg} />);
    expect(screen.queryByText('Name')).toBeNull();
  });

  it('renders organization name when profile has org', () => {
    renderWithProviders(<UserOrg profile={mockProfileWithOrg} />);
    expect(screen.getByText('Test Organization')).toBeInTheDocument();
  });

  it('renders default organization name when org name is null', () => {
    const profileWithNullOrgName = {
      ...mockProfileWithOrg,
      org: { ...mockProfileWithOrg.org, name: null },
    };
    // @ts-expect-error - intentionally passing invalid data to test default behavior
    renderWithProviders(<UserOrg profile={profileWithNullOrgName} />);
    expect(screen.getByText('My Organization')).toBeInTheDocument();
  });

  it('shows integrated status with check icon when rcrainfoIntegrated is true', () => {
    renderWithProviders(<UserOrg profile={mockProfileWithOrg} />);
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('shows non-integrated status with cross icon when rcrainfoIntegrated is false', () => {
    renderWithProviders(<UserOrg profile={mockProfileWithNonIntegratedOrg} />);
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('renders tabs for My Sites and Other Sites in My Organization', () => {
    renderWithProviders(<UserOrg profile={mockProfileWithOrg} />);
    expect(screen.getByText('My Sites')).toBeInTheDocument();
    expect(screen.getByText('Other Sites in My Organization')).toBeInTheDocument();
  });
});
