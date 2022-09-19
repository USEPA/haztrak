// utility wrapper for '@testing-library/react so we do not need to
// use Redux store Provider and BrowserRouter in all test.js files, see
// https://testing-library.com/docs/react-testing-library/setup/#custom-render
import React from 'react';
import { render } from '@testing-library/react';
import { RootState, setupStore } from 'app/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

interface Props {
  children: JSX.Element;
  initialState: RootState;
}

const AllTheProviders = ({ children, initialState }: Props) => {
  return (
    <Provider store={setupStore(initialState)}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

const customRender = (ui: JSX.Element, options: any | null) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';

// replace @testing-library/react's render function with our own custom render
export { customRender as render };
