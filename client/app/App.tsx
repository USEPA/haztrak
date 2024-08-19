import { ReactElement, Suspense } from 'react';
import { Container } from 'react-bootstrap';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ErrorBoundary } from '~/components/Error';
import { Notifications } from '~/components/Notifications/Notifications';
import { router } from '~/routes';
import './App.scss';
import './globals.css';
import { Spinner } from './components/ui';

const GlobalSpinner = () => (
  <Container fluid className="d-flex justify-content-center align-items-center vh-100">
    <Spinner size="sm" className="my-auto" />
  </Container>
);

function App(): ReactElement {
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
      <Suspense fallback={<GlobalSpinner />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
