import { ErrorPage } from 'features/ErrorPage/ErrorPage';
import { Login } from 'features/Login';
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

const Dashboard = React.lazy(() => import('features/Dashboard'));
const Profile = React.lazy(() => import('features/Profile'));
const SiteList = React.lazy(() => import('features/SiteList'));
const SiteDetails = React.lazy(() => import('features/SiteDetails'));
const Help = React.lazy(() => import('features/About'));

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
                lazy: () => import('./features/ManifestList'),
              },
              {
                path: 'new',
                lazy: () => import('./features/NewManifest'),
              },
              {
                path: ':mtn/:action',
                lazy: () => import('./features/ManifestDetails'),
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
            lazy: () => import('./features/ManifestList'),
          },
          {
            path: 'new',
            lazy: () => import('./features/NewManifest'),
          },
          {
            path: ':mtn/:action',
            lazy: () => import('./features/ManifestDetails'),
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
    lazy: () => import('./features/RegisterHero'),
  },
  {
    path: '*',
    element: <ErrorPage code={404} />,
  },
]);
