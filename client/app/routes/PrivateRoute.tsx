import React, { ReactElement } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useGetUserQuery } from '~/store';

/** Redirect to the login if user is not authenticated*/
export default function PrivateRoute(): ReactElement {
  const { data: user, isLoading } = useGetUserQuery();
  // ToDo: test this logic to ensure server state confirms the user is authenticated
  if (!user && !isLoading) {
    return <Navigate to="/login" />;
  }
  // Block rendering until we know if the user is authenticated
  return <>{!isLoading && <Outlet />}</>;
}

export { PrivateRoute as Component };
