import { ErrorBoundary } from '~/components/Error';
import { HtSpinner } from '~/components/UI';
import React, { createContext, Dispatch, SetStateAction, Suspense, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { Sidebar } from './Sidebar/Sidebar';
import { TopNav } from './TopNav/TopNav';

export interface NavContextProps {
  showSidebar: boolean;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
}

export const NavContext = createContext<NavContextProps>({
  showSidebar: false,
  setShowSidebar: () => console.warn('no showSidebar context'),
});

export function Root() {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <NavContext.Provider value={{ showSidebar, setShowSidebar }}>
      <PrivateRoute>
        <div>
          <TopNav />
          <Sidebar />
          <Container fluid>
            <ErrorBoundary>
              <Suspense fallback={<HtSpinner center className="my-auto" />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </Container>
        </div>
      </PrivateRoute>
    </NavContext.Provider>
  );
}
