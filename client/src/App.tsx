import { ReactElement } from 'react';
import { RouterProvider } from 'react-router/dom';
import 'react-toastify/dist/ReactToastify.css';
import { AppProvider } from '~/providers';
import { router } from '~/routes';
import './globals.css';

function App(): ReactElement {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

export default App;
