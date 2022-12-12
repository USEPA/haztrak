import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from 'store';

// initiate the mock service worker if deployed in TEST environment
// intercepts API calls and returns fake/test responses
if (
  process.env.REACT_APP_HT_ENV &&
  process.env.REACT_APP_HT_ENV.toUpperCase() === 'TEST'
) {
  const { worker } = require('./test/mock/browser');
  worker.start();
}

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
