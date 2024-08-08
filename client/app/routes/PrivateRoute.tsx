import React, { ReactElement } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useGetUserQuery } from '~/store';

/** Redirect to the login if user is not authenticated*/
export default function PrivateRoute(): ReactElement {
  const { data: user, isLoading, error } = useGetUserQuery();
  if ((!user && !isLoading) || error) {
    return <Navigate to="/login" />;
  }
  return <>{!isLoading && <Outlet />}</>;
}

export { PrivateRoute as Component };
