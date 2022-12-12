import { handlers } from './mock/handlers';
import React, { PropsWithChildren, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AppStore, RootState, setupStore } from 'store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PreloadedState } from '@reduxjs/toolkit';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

/** utility wrapper for @testing-library/react, so we do not need to
 * use Redux store Provider and BrowserRouter in all tests, see
 * https://testing-library.com/docs/react-testing-library/setup/#custom-render
 *
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
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): ReactElement {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export * from '@testing-library/react';

// replace @testing-library/React's render function with our own custom render
export { handlers, renderWithProviders as render };
