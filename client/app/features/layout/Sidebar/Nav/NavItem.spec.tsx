import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NavContext } from '~/features/layout/Root';
import { NavItem } from '~/features/layout/Sidebar/Nav/NavItem';
import { Route } from '~/features/layout/Sidebar/SidebarRoutes';
import { renderWithProviders } from '~/mocks';

const mockRoute: Route = {
  id: 'test',
  url: '/test',
  text: 'Test Route',
  icon: vi.fn(),
  external: false,
};

const mockSetShowSidebar = vi.fn();

const renderNavItem = (route = mockRoute, targetBlank = false) => {
  return renderWithProviders(
    <NavContext.Provider value={{ showSidebar: true, setShowSidebar: mockSetShowSidebar }}>
      <NavItem route={route} targetBlank={targetBlank} />
    </NavContext.Provider>
  );
};

describe('NavItem', () => {
  it('renders the NavItem with the correct text', () => {
    renderNavItem();
    expect(screen.getByText('Test Route')).toBeInTheDocument();
  });

  it('calls setShowSidebar when the link is clicked', () => {
    renderNavItem();
    fireEvent.click(screen.getByRole('link'));
    expect(mockSetShowSidebar).toHaveBeenCalledWith(false);
  });

  it('opens link in a new tab when targetBlank is true', () => {
    renderNavItem(mockRoute, true);
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
  });

  it('does not open link in a new tab when targetBlank is false', () => {
    renderNavItem(mockRoute, false);
    expect(screen.getByRole('link')).not.toHaveAttribute('target', '_blank');
  });
});
