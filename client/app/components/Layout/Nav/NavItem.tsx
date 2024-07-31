import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavContext, NavContextProps } from 'components/Layout/Root';
import { Route } from 'components/Layout/Sidebar/SidebarRoutes';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-bootstrap';

interface NavItemProps {
  route: Route;
  targetBlank?: boolean;
}

export function NavItem({ route, targetBlank }: NavItemProps) {
  const { showSidebar, setShowSidebar } = useContext<NavContextProps>(NavContext);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <NavLink
      className="text-decoration-none text-dark py-2 d-flex align-items-center "
      as={Link}
      to={route.url}
      target={targetBlank ? '_blank' : undefined}
      onClick={toggleSidebar}
    >
      <FontAwesomeIcon icon={route.icon} className="me-2 text-primary ms-2" size="lg" />
      <span className=" mb-0">{route.text}</span>
      {route.external && (
        <FontAwesomeIcon
          icon={faArrowUpRightFromSquare}
          className="text-danger pb-2 ms-1"
          size="xs"
        />
      )}
    </NavLink>
  );
}
