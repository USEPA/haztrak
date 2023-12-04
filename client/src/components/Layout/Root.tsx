import { ErrorBoundary } from 'components/Error';
import React, { createContext, Dispatch, SetStateAction, Suspense, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { Sidebar } from './Sidebar/Sidebar';
import { TopNav } from './TopNav/TopNav';
import { HtSpinner } from 'components/UI';

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
        <TopNav />
        <Sidebar />
        <Container fluid>
          <ErrorBoundary>
            <Suspense
              fallback={
                <Container fluid className="d-flex justify-content-center vh-100">
                  <HtSpinner size="7x" />
                </Container>
              }
            >
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </Container>
      </PrivateRoute>
    </NavContext.Provider>
  );
}
