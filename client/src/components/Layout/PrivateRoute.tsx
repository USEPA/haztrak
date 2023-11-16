import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'store';
import { selectUserName } from 'store/authSlice';

interface Props {
  children: any;
}

/**
 * Wraps around Route component to redirect to og in if not authenticated user
 * @param { children } Route to wrap around
 * @constructor
 */
export function PrivateRoute({ children }: Props): ReactElement {
  const authUser = useAppSelector(selectUserName);
  if (!authUser) {
    // not logged in so redirect to login page with the return url
    return <Navigate to="/login" />;
  }
  // authorized so return child components
  return children;
}
