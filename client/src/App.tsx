import { ErrorBoundary } from 'components/ErrorBoundary';
import React, { ReactElement, useEffect } from 'react';
import { RouterProvider, useNavigate } from 'react-router-dom';
import { router } from 'routes';
import { useAppDispatch, useAppSelector } from 'store';
import { getRcraProfile, selectRcraProfile } from 'store/profileSlice';
import { getHaztrakProfile } from 'store/profileSlice/profile.slice';
import { selectUserName } from 'store/userSlice';
import { getHaztrakUser } from 'store/userSlice/user.slice';
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
