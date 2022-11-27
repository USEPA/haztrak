import React, { ReactElement } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

interface Props {
  children: any;
  authUser: string | undefined;
}

/**
 * Wraps around Route component to redirect to og in if not authenticated user
 * @param { children } Route to wrap around
 * @returns {JSX.Element|*}
 * @constructor
 */
function PrivateRoute({ children, authUser }: Props): ReactElement {
  const navigate = useNavigate();
  if (!authUser) {
    // not logged in so redirect to login page with the return url
    return <Navigate to="/login" />;
  }
  // authorized so return child components
  return children;
}

export default PrivateRoute;
