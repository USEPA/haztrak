import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { rootStore } from '~/store';
import App from './App';
import React from 'react';

// Start mock service worker in development mode
async function enableMocking() {
  if (process.env.NODE_ENV !== 'test') {
    return;
  }
  const { worker } = await import('./mocks/browser');
  return worker.start();
}

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

enableMocking().then(() => {
  root.render(
    <React.StrictMode>
      <Provider store={rootStore}>
        <App />
      </Provider>
    </React.StrictMode>
  );
});
