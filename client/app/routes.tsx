import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ErrorPage } from '~/features/ErrorPage/ErrorPage';
import { Login } from '~/features/login';
import { orgsLoader } from '~/features/org';

const Dashboard = React.lazy(() => import('~/features/dashboard'));
const Profile = React.lazy(() => import('~/features/profile'));
const SiteList = React.lazy(() => import('~/features/SiteList'));
const SiteDetails = React.lazy(() => import('~/features/SiteDetails'));
const Help = React.lazy(() => import('~/features/about'));
const Org = React.lazy(() => import('~/features/org'));
const PrivateRoute = React.lazy(() => import('~/features/PrivateRoute'));

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    lazy: () => import('~/features/register'),
  },
  {
    path: '',
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        lazy: () => import('./components/Layout'),
        children: [
          {
            path: '',
            element: <Org />,
            loader: orgsLoader,
            children: [
              {
                path: '',
                element: <Dashboard />,
              },
              {
                path: '/profile',
                element: <Profile />,
              },
              {
                path: '/site',
                children: [
                  {
                    path: '',
                    element: <SiteList />,
                  },
                  {
                    path: ':siteId',
                    element: <SiteDetails />,
                  },
                  {
                    path: ':siteId/manifest',
                    children: [
                      {
                        path: '',
                        lazy: () => import('~/features/ManifestList'),
                      },
                      {
                        path: 'new',
                        lazy: () => import('~/features/NewManifest'),
                      },
                      {
                        path: ':mtn/:action',
                        lazy: () => import('~/features/ManifestDetails'),
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            path: '/manifest',
            children: [
              {
                path: '',
                lazy: () => import('~/features/ManifestList'),
              },
              {
                path: 'new',
                lazy: () => import('~/features/NewManifest'),
              },
              {
                path: ':mtn/:action',
                lazy: () => import('~/features/ManifestDetails'),
              },
            ],
          },
          {
            path: '/about',
            element: <Help />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage code={404} />,
  },
]);
