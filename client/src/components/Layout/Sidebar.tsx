import { NavDropdown } from 'components/Layout/Nav/NavDropdown';
import { NavItem } from 'components/Layout/Nav/NavItem';
import React, { ReactElement, useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { routes } from './SidebarRoutes';

interface SidebarProps {
  show: boolean;
  onHide: (show: boolean) => void;
}

/**
 * Vertical sidebar for navigation that disappears when the viewport is small
 * @returns {ReactElement|null}
 * @constructor
 */
export function Sidebar({ show, onHide }: SidebarProps): ReactElement | null {
  const [siteNav, setSiteNav] = useState(false);
  const [helpNav, setHelpNav] = useState(false);
  const [mtnNav, setMtnNav] = useState(false);

  const authUser = useSelector((state: RootState) => state.auth.user);
  if (!authUser) return null;
  return (
    <Offcanvas show={show} onHide={onHide}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Offcanvas</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <nav className="sb-sidenav" id="sidenavAccordion">
          <div className="sb-sidenav-menu">
            <div className="nav">
              <div className="sb-sidenav-menu-heading">Apps</div>
              {routes.map((route) => {
                if (typeof route === 'object' && 'routes' in route) {
                  return <NavDropdown key={route.id} section={route} />;
                } else if (typeof route === 'object' && 'url' in route) {
                  return <NavItem key={route.id} route={route} />;
                }
              })}
            </div>
          </div>
        </nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
