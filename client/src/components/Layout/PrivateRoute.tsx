import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'store';
import { selectAuthenticated } from 'store/authSlice/auth.slice';

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
