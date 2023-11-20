import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { rootStore } from 'store';
import App from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

// initiate the mock service worker if deployed in TEST environment
// intercepts API calls and returns fake/test responses
if (import.meta.env.VITE_HT_ENV && import.meta.env.VITE_HT_ENV.toUpperCase() === 'TEST') {
  const { worker } = require('./test-utils/mock/browser');
  worker.start();
}

root.render(
  <React.StrictMode>
    <Provider store={rootStore}>
      <App />
    </Provider>
  </React.StrictMode>
);
