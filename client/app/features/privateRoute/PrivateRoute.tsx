import React, { ReactElement } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { Spinner } from '~/components/ui';
import { useAuth } from '~/hooks';

/** Redirect to the login if the user is not authenticated*/
export const PrivateRoute = (): ReactElement => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};
