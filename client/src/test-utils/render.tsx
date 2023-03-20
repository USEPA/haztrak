import { PreloadedState } from '@reduxjs/toolkit';
import { render, RenderOptions } from '@testing-library/react';
import React, { PropsWithChildren, ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { AppStore, RootState, setupStore } from 'store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
  defaultValues?: object;
}

/**
 *
 * @description
 * utility wrapper for @testing-library/react, so we do not need to
 * use Redux store Provider and BrowserRouter in all tests, see
 * https://testing-library.com/docs/react-testing-library/setup/#custom-render
 *
 * for components expected to be rendered within FormProvider context,
 * see https://github.com/react-hook-form/react-hook-form/discussions/3815
 * @example
 *describe('HelloWorld Test Suite', () => {
 *  test('test name', () => {
 *    renderWithProviders(<HelloWorldComponent />);
 *    expect(screen.getByText(/Hello World/i)).toBeInTheDocument();
 *  });
 *});
 */
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {}, // an object with partial slices of our redux state
    defaultValues = {}, // for Forms
    store = setupStore(preloadedState), // Automatically create a store instance if no store was passed in
    ...renderOptions // react-testing library function options
  }: ExtendedRenderOptions = {} // default to empty object
) {
  function Wrapper({ children }: PropsWithChildren<{}>): ReactElement {
    const formMethods = useForm({ defaultValues });
    return (
      <Provider store={store}>
        <BrowserRouter>
          <FormProvider {...formMethods}>{children}</FormProvider>
        </BrowserRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
