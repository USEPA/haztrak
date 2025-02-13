import React, { ReactElement, useContext } from 'react';
import { Link } from 'react-router';
import { OrgSelect } from '~/components/Org/OrgSelect';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui';
import { NavContext, NavContextProps } from '~/features/layout/Root';
import logo from '/assets/img/haztrak-logos/haztrak-logo-zip-file/png/logo-black-crop.png';
import { NavItem } from './Nav/NavItem';
import { NavSection } from './Nav/NavSection';
import { routes } from './SidebarRoutes';

/** Vertical sidebar for navigation that disappears when the viewport is small*/
export function Sidebar(): ReactElement | null {
  const { showSidebar, setShowSidebar } = useContext<NavContextProps>(NavContext);

  return (
    <Sheet open={showSidebar} onOpenChange={setShowSidebar}>
      <SheetContent side="left" className="tw-flex tw-flex-col tw-items-start">
        <SheetHeader>
          <SheetTitle asChild>
            <Link to="/" className="tw-flex tw-justify-center">
              <img
                src={logo}
                alt="haztrak logo, hazardous waste tracking made easy."
                width={200}
                height={'auto'}
                className=""
              />
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="tw-mx-auto tw-flex tw-w-full tw-items-center tw-justify-center md:tw-hidden">
          <OrgSelect />
        </div>
        <nav>
          {routes.map((route) => {
            if (typeof route === 'object' && 'routes' in route) {
              return <NavSection key={route.id} section={route} />;
            } else if (typeof route === 'object' && 'url' in route) {
              return <NavItem key={route.id} route={route} />;
            }
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
