import logo from 'assets/haztrak-logos/haztrak-logo-zip-file/png/logo-black-crop.png';
import { NavDropdown } from 'components/Layout/Nav/NavDropdown';
import { NavItem } from 'components/Layout/Nav/NavItem';
import { NavContext, NavContextProps } from 'components/Layout/Root';
import React, { ReactElement, useContext } from 'react';
import { Nav, Offcanvas } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
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
export function Sidebar(): ReactElement | null {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const { showSidebar, setShowSidebar } = useContext<NavContextProps>(NavContext);

  if (!authUser) return null;
  return (
    <Offcanvas show={showSidebar} onHide={setShowSidebar}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <Link to="/home" className="navbar-brand ps-1 mb-0">
            <img
              src={logo}
              alt="haztrak logo, hazardous waste tracking made easy."
              width={200}
              height={'auto'}
            />
          </Link>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <nav className="sb-sidenav" id="sidenavAccordion">
          <Nav className="flex-column">
            {routes.map((route) => {
              if (typeof route === 'object' && 'routes' in route) {
                return <NavDropdown key={route.id} section={route} />;
              } else if (typeof route === 'object' && 'url' in route) {
                return <NavItem key={route.id} route={route} />;
              }
            })}
          </Nav>
        </nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
