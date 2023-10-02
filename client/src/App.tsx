import { ErrorBoundary } from 'components/ErrorBoundary';
import React, { ReactElement, useEffect } from 'react';
import { RouterProvider, useNavigate } from 'react-router-dom';
import { router } from 'routes';
import { useAppDispatch, useAppSelector } from 'store';
import { getProfile, selectRcraProfile } from 'store/rcraProfileSlice';
import { selectUserName } from 'store/userSlice';
import { getHaztrakUser } from 'store/userSlice/user.slice';
import './App.scss';

function App(): ReactElement {
  const userName = useAppSelector(selectUserName);
  const profile = useAppSelector(selectRcraProfile);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userName) {
      dispatch(getProfile());
      dispatch(getHaztrakUser());
    }
  }, [profile.user]);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
