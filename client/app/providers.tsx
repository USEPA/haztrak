import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { ErrorBoundary } from '~/components/Error';
import { Spinner } from '~/components/ui';
import { rootStore } from '~/store';

interface AppProviderProps {
  children: React.ReactNode;
}

const GlobalSpinner = () => (
  <div className="align-items-center tw-flex tw-h-screen tw-justify-center">
    <Spinner size="lg" />
  </div>
);

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <Suspense fallback={<GlobalSpinner />}>
      <Provider store={rootStore}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </Provider>
    </Suspense>
  );
};
