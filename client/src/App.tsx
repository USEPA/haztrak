import { ErrorBoundary } from 'components/Error';
import { Notifications } from 'components/Notifications/Notifications';
import React, { ReactElement, Suspense, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import { HtSpinner } from 'components/UI';

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
        limit={3}
      />
      <Notifications />
      <Suspense fallback={<HtSpinner />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
