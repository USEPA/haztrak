import React, { ReactElement } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '~/hooks/useAuth/useAuth';

/** Redirect to the login if user is not authenticated*/
export default function PrivateRoute(): ReactElement {
  // ToDo: when user is loading, do not redirect to login.
  const location = useLocation();
  const auth = useAuth();

  return auth.user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}

export { PrivateRoute as Component };
