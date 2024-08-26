import React, { createContext, Dispatch, SetStateAction, Suspense, useState } from 'react';
import { LoaderFunction, Outlet } from 'react-router-dom';
import { Spinner } from '~/components/ui';
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
    .catch((_err) => null)
    .finally(() => query.unsubscribe());
};

export function Root() {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <NavContext.Provider value={{ showSidebar, setShowSidebar }}>
      <TopNav />
      <Sidebar />
      <main className="tw-mx-8 tw-mt-20">
        <Suspense fallback={<Spinner size="xl" className="my-auto" />}>
          <Outlet />
        </Suspense>
      </main>
    </NavContext.Provider>
  );
}
