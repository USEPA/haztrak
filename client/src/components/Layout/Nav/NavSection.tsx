import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavItem } from 'components/Layout/Nav/NavItem';
import { RoutesSection } from 'components/Layout/Sidebar/SidebarRoutes';
import React, { useState } from 'react';
import { Button, Collapse } from 'react-bootstrap';

interface SidebarSectionProps {
  section: RoutesSection;
}

export function NavSection({ section }: SidebarSectionProps) {
  return (
    <>
      <hr className="my-0" />
      <p className="text-secondary mt-1 mb-1">{section.name}</p>
      {section.routes.map((route) => {
        return (
          <div key={route.id}>
            <NavItem route={route} />
          </div>
        );
      })}
    </>
  );
}
