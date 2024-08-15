import logo from '/assets/img/haztrak-logos/haztrak-logo-zip-file/png/logo-black-crop.png';
import { NavSection } from '~/components/Layout/Nav/NavSection';
import { NavItem } from '~/components/Layout/Nav/NavItem';
import { NavContext, NavContextProps } from '~/components/Layout/Root';
import React, { ReactElement, useContext } from 'react';
import { Link } from 'react-router-dom';
import { routes } from './SidebarRoutes';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui';

/** Vertical sidebar for navigation that disappears when the viewport is small*/
export function Sidebar(): ReactElement | null {
  const { showSidebar, setShowSidebar } = useContext<NavContextProps>(NavContext);

  return (
    <Sheet open={showSidebar} onOpenChange={setShowSidebar}>
      <SheetContent side="left">
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
