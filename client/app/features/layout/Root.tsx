import React, { createContext, Dispatch, SetStateAction, Suspense, useState } from 'react';
import { Container } from 'react-bootstrap';
import { LoaderFunction, Outlet } from 'react-router-dom';
import { ErrorBoundary } from '~/components/Error';
import { HtSpinner } from '~/components/legacyUi';
import { rootStore as store } from '~/store';
import { haztrakApi } from '~/store/htApi.slice';
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

export const rootLoader: LoaderFunction = async () => {
  const query = store.dispatch(haztrakApi.endpoints.getOrgs.initiate());

  return query
    .unwrap()
    .catch((_err) => console.error('Error fetching orgs'))
    .finally(() => query.unsubscribe());
};

export function Root() {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <NavContext.Provider value={{ showSidebar, setShowSidebar }}>
      <div>
        <TopNav />
        <Sidebar />
        <Container fluid className="tw-mt-20">
          <ErrorBoundary>
            <Suspense fallback={<HtSpinner center className="my-auto" />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </Container>
      </div>
    </NavContext.Provider>
  );
}
