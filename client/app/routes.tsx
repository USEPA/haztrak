import { createBrowserRouter } from 'react-router';
import { ErrorPage } from '~/features/errorPage/ErrorPage';
import { ExampleRoute } from '~/features/example/ExampleRoute';
import { Login } from '~/features/login';
import { Component as PrivateRoute } from '~/features/privateRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        path: '',
        lazy: () => import('~/features/layout'),
        children: [
          {
            path: 'organization',
            lazy: () => import('~/features/org'),
          },
          {
            path: '',
            lazy: () => import('~/features/dashboard'),
          },
          {
            path: 'profile',
            lazy: () => import('~/features/profile'),
          },
          {
            path: 'site',
            children: [
              {
                path: '',
                lazy: () => import('~/features/siteList'),
              },
              {
                path: ':siteId',
                lazy: () => import('~/features/siteDetails'),
              },
              {
                path: ':siteId/manifest',
                children: [
                  {
                    path: '',
                    lazy: () => import('~/features/manifestList'),
                  },
                  {
                    path: 'new',
                    lazy: () => import('~/features/newManifest'),
                  },
                  {
                    path: ':mtn/:action',
                    lazy: () => import('~/features/manifestDetails'),
                  },
                ],
              },
            ],
          },
          {
            path: 'manifest',
            children: [
              {
                path: '',
                lazy: () => import('~/features/manifestList'),
              },
              {
                path: 'new',
                lazy: () => import('~/features/newManifest'),
              },
              {
                path: ':mtn/:action',
                lazy: () => import('~/features/manifestDetails'),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'register',
    lazy: () => import('~/features/register'),
  },
  {
    path: 'about',
    lazy: () => import('~/features/about'),
  },
  {
    path: 'account/:accountPath',
    element: <ExampleRoute />,
  },
  {
    path: '*',
    element: <ErrorPage code={404} />,
  },
]);
