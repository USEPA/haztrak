import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RoutesSection } from '~/features/layout/Sidebar/SidebarRoutes';
import { renderWithProviders } from '~/mocks';
import { NavSection } from './NavSection';

const mockSection: RoutesSection = {
  icon: () => <div>icon</div>,
  id: '',
  name: 'Test Section',
  routes: [
    {
      id: '1',
      text: 'Route 1',
      icon: () => <div>icon</div>,
      url: '',
    },
  ],
};

describe('NavSection', () => {
  it('renders section name', () => {
    const { getByText } = renderWithProviders(<NavSection section={mockSection} />);
    expect(getByText(/Test Section/i)).toBeInTheDocument();
  });

  it('renders NavItem components for each route', () => {
    const { getByText } = renderWithProviders(<NavSection section={mockSection} />);
    expect(getByText(/Route 1/i)).toBeInTheDocument();
  });

  it('handles empty routes array', () => {
    // @ts-expect-error - expected error
    const section: RoutesSection = { name: 'Test Section', routes: [] };
    const { container } = render(<NavSection section={section} />);
    expect(container.querySelectorAll('div').length).toBe(2); // One for the main div and one for the separator
  });
});
