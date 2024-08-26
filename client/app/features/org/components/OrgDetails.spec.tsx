import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '~/mocks';
import { createMockOrg } from '~/mocks/fixtures/mockUser';
import { OrgDetails } from './OrgDetails';

const mockOrg = createMockOrg();

describe('OrgDetails Component', () => {
  it('renders the organization details heading', () => {
    renderWithProviders(<OrgDetails org={mockOrg} />);
    const headingElement = screen.getByText(mockOrg.name);
    expect(headingElement).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    const { container } = renderWithProviders(<OrgDetails org={mockOrg} />);
    expect(container).toBeDefined();
  });
});
