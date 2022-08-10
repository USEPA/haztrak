// utility wrapper for '@testing-library/react so we do not need to
// use Redux store Provider and BrowserRouter in all test.js files, see
// https://testing-library.com/docs/react-testing-library/setup/#custom-render
import React from 'react';
import { render } from '@testing-library/react';
import { setupStore } from '../app/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

const AllTheProviders = ({ children }) => {
  return (
    <Provider store={setupStore()}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';

// replace @testing-library/react's render function with our own custom render
export { customRender as render };
