import { ErrorPage } from '~/routes/ErrorPage/ErrorPage';
import { Login } from '~/routes/login';
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { orgsLoader } from '~/routes/org';

const Dashboard = React.lazy(() => import('~/routes/dashboard'));
const Profile = React.lazy(() => import('~/routes/profile'));
const SiteList = React.lazy(() => import('~/routes/SiteList'));
const SiteDetails = React.lazy(() => import('~/routes/SiteDetails'));
const Help = React.lazy(() => import('~/routes/about'));
const Org = React.lazy(() => import('~/routes/org'));

export const router = createBrowserRouter([
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
                    lazy: () => import('./routes/ManifestList'),
                  },
                  {
                    path: 'new',
                    lazy: () => import('./routes/NewManifest'),
                  },
                  {
                    path: ':mtn/:action',
                    lazy: () => import('./routes/ManifestDetails'),
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
            lazy: () => import('./routes/ManifestList'),
          },
          {
            path: 'new',
            lazy: () => import('./routes/NewManifest'),
          },
          {
            path: ':mtn/:action',
            lazy: () => import('./routes/ManifestDetails'),
          },
        ],
      },
      {
        path: '/about',
        element: <Help />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    lazy: () => import('./routes/register'),
  },
  {
    path: '*',
    element: <ErrorPage code={404} />,
  },
]);
