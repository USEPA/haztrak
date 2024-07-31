import { ErrorPage } from 'routes/ErrorPage/ErrorPage';
import { Login } from 'routes/Login';
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

const Dashboard = React.lazy(() => import('routes/Dashboard'));
const Profile = React.lazy(() => import('routes/Profile'));
const SiteList = React.lazy(() => import('routes/SiteList'));
const SiteDetails = React.lazy(() => import('routes/SiteDetails'));
const Help = React.lazy(() => import('routes/About'));

export const router = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('./components/Layout'),
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
    lazy: () => import('./routes/RegisterHero'),
  },
  {
    path: '*',
    element: <ErrorPage code={404} />,
  },
]);
