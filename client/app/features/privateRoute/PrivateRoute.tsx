import React, { ReactElement } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '~/hooks';

/** Redirect to the login if the user is not authenticated*/
export const PrivateRoute = (): ReactElement => {
  // ToDo: when user is loading, do not redirect to login.
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};
