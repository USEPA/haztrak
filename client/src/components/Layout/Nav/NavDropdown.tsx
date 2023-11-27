import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavItem } from 'components/Layout/Nav/NavItem';
import { RoutesSection } from 'components/Layout/SidebarRoutes';
import React, { useState } from 'react';
import { Button, Collapse } from 'react-bootstrap';

interface SidebarSectionProps {
  section: RoutesSection;
}

export function NavDropdown({ section }: SidebarSectionProps) {
  const [collapse, setCollapse] = useState(true);
  return (
    <>
      <Button
        className="border-0 nav-link shadow-none"
        onClick={() => setCollapse(!collapse)}
        aria-controls="collapseSite"
        aria-expanded={collapse}
      >
        {section.icon}
        {section.name}
        <div className={`sb-sidenav-collapse-arrow ${collapse ? '' : 'rotate-90-cc'} `}>
          <FontAwesomeIcon icon={faAngleDown} size="lg" />
        </div>
      </Button>
      <Collapse in={collapse}>
        <div>
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
