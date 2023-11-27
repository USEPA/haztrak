import { Route } from 'components/Layout/SidebarRoutes';
import React from 'react';
import { Link } from 'react-router-dom';

interface NavItemProps {
  route: Route;
  targetBlank?: boolean;
}

export function NavItem({ route, targetBlank }: NavItemProps) {
  return (
    <Link className="nav-link" to={route.url} target={targetBlank ? '_blank' : undefined}>
      <span className="me-2">{route.icon}</span>
      <span>{route.text}</span>
    </Link>
  );
}
