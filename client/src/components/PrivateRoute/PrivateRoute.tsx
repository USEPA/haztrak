import React from 'react';
import { Navigate } from 'react-router-dom';

import history from 'utils';
import { RootState } from 'redux/store';

interface Props {
  children: any;
  authUser: string | undefined;
}

/**
 * Wraps around Route component to redirect to login if not authenticated user
 * @param { children } Route to wrap around
 * @returns {JSX.Element|*}
 * @constructor
 */
function PrivateRoute({ children, authUser }: Props): JSX.Element {
  if (!authUser) {
    // not logged in so redirect to login page with the return url
    return <Navigate to="/login" state={{ from: history.location }} />;
  }
  // authorized so return child components
  return children;
}

export default PrivateRoute;
