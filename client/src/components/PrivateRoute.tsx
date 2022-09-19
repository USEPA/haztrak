import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import history from 'utils';
import { RootState } from 'app/store';

/**
 * Wraps around Route component to redirect to login if not authenticated user
 * @param { children } Route to wrap around
 * @returns {JSX.Element|*}
 * @constructor
 */
function PrivateRoute({ children }: any): JSX.Element {
  const { user: authUser } = useSelector((state: RootState) => state.user);
  if (!authUser) {
    // not logged in so redirect to login page with the return url
    return <Navigate to="/login" state={{ from: history.location }} />;
  }
  // authorized so return child components
  return children;
}

export default PrivateRoute;
