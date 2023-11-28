import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavContext, NavContextProps } from 'components/Layout/Root';
import { Route } from 'components/Layout/Sidebar/SidebarRoutes';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

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
    <Link
      className="text-decoration-none text-secondary py-2 d-flex align-items-center "
      to={route.url}
      target={targetBlank ? '_blank' : undefined}
      onClick={toggleSidebar}
    >
      <FontAwesomeIcon icon={route.icon} size="lg" className="me-2 text-primary" />
      <span className="h6 mb-0">{route.text}</span>
      {route.external && (
        <FontAwesomeIcon
          icon={faArrowUpRightFromSquare}
          className="text-danger pb-2 ms-1"
          size="xs"
        />
      )}
    </Link>
  );
}
