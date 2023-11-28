import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavItem } from 'components/Layout/Nav/NavItem';
import { RoutesSection } from 'components/Layout/Sidebar/SidebarRoutes';
import React, { useState } from 'react';
import { Button, Collapse } from 'react-bootstrap';

interface SidebarSectionProps {
  section: RoutesSection;
}

export function NavDropdown({ section }: SidebarSectionProps) {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <>
      <Button
        className="border-0 shadow-none bg-transparent d-flex py-2 ps-0 position-relative align-items-center"
        onClick={() => setCollapsed(!collapsed)}
        aria-controls="collapseSite"
        aria-expanded={collapsed}
      >
        <span>
          <FontAwesomeIcon icon={section.icon} size="xl" className="me-2 text-primary" />
        </span>
        <span className="text-secondary h6 mb-0">{section.name}</span>
        <span
          className={`sb-sidenav-collapse-arrow nav-dropdown-arrow d-inline-block ms-auto text-secondary ${
            !collapsed ? '' : 'rotate-90-cc'
          } `}
        >
          <FontAwesomeIcon icon={faAngleDown} size="lg" />
        </span>
      </Button>
      <Collapse in={!collapsed}>
        <div className="ms-3">
          {section.routes.map((route) => {
            return (
              <div className="ms-4" key={route.id}>
                <NavItem route={route} />
              </div>
            );
          })}
        </div>
      </Collapse>
    </>
  );
}
