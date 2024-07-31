import { NavItem } from '~/components/Layout/Nav/NavItem';
import { RoutesSection } from '~/components/Layout/Sidebar/SidebarRoutes';
import React from 'react';

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
