// import React from 'react';
// import { render, cleanup } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import PrivateRoute from './index';
// import { Provider } from 'react-redux';
// import { store } from 'app/store';
// import { BrowserRouter } from 'react-router-dom';
//
// afterEach(() => {
//   cleanup();
//   jest.resetAllMocks();
// });

// describe('PrivateRoute', () => {
//   test('renders with title', () => {
//     const { debug } = render(
//       <Provider store={store}>
//         <BrowserRouter>
//           <PrivateRoute />
//         </BrowserRouter>
//       </Provider>
//     );
//     // expect(screen.getByText('hello')).toBeInTheDocument();
//     // eslint-disable-next-line testing-library/no-debugging-utils
//     debug(undefined, Infinity);
//   });
//   // test('Catches errors and still renders', () => {
//   //   render();
//   //   expect(screen.getByText('hello')).toBeInTheDocument();
//   // });
// });
