import { ErrorBoundary } from 'components/ErrorBoundary';
import React, { ReactElement, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from 'routes';
import {
  getHaztrakProfile,
  getHaztrakUser,
  getRcraProfile,
  selectRcraProfile,
  selectUserName,
  useAppDispatch,
  useAppSelector,
} from 'store';
import './App.scss';

function App(): ReactElement {
  const userName = useAppSelector(selectUserName);
  const profile = useAppSelector(selectRcraProfile);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userName) {
      dispatch(getRcraProfile());
      dispatch(getHaztrakUser());
      dispatch(getHaztrakProfile());
    }
  }, [profile.user]);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
