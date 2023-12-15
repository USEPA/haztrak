import { ErrorBoundary } from 'components/Error';
import { Notifications } from 'components/Notifications/Notifications';
import { HtSpinner } from 'components/UI';
import React, { ReactElement, Suspense, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { router } from 'routes';
import {
  getHaztrakProfile,
  getHaztrakUser,
  getRcraProfile,
  selectHaztrakProfile,
  selectUserName,
  useAppDispatch,
  useAppSelector,
} from 'store';
import './App.scss';

function App(): ReactElement {
  const userName = useAppSelector(selectUserName);
  const profile = useAppSelector(selectHaztrakProfile);
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
      <Suspense
        fallback={
          <Container fluid className="d-flex justify-content-center align-items-center vh-100">
            <HtSpinner size="6x" className="my-auto" />
          </Container>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
