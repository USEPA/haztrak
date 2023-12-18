import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { selectAuthenticated, useAppSelector } from 'store';

interface Props {
  children: any;
}

/** Redirect to the login if user is not authenticated*/
export function PrivateRoute({ children }: Props): ReactElement {
  const authUser = useAppSelector(selectAuthenticated);
  if (!authUser) {
    return <Navigate to="/login" />;
  }
  return children;
}
