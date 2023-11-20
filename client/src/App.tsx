import { ErrorBoundary } from 'components/ErrorBoundary';
import React, { ReactElement, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
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
import 'react-toastify/dist/ReactToastify.css';
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
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
