import { Root } from 'components/Layout/Root';
import { ErrorPage } from 'features/ErrorPage/ErrorPage';
import { Login } from 'features/login';
import { createBrowserRouter } from 'react-router-dom';
import React from 'react';

const Dashboard = React.lazy(() => import('features/Dashboard'));
const Profile = React.lazy(() => import('features/profile'));
const SiteList = React.lazy(() => import('features/SiteList'));
const SiteDetails = React.lazy(() => import('features/SiteDetails'));
const Help = React.lazy(() => import('features/help'));

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
                lazy: () => import('./features/manifestList'),
              },
              {
                path: 'new',
                lazy: () => import('./features/newManifest'),
              },
              {
                path: ':mtn/:action',
                lazy: () => import('./features/manifestDetails'),
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
            lazy: () => import('./features/manifestList'),
          },
          {
            path: 'new',
            lazy: () => import('./features/newManifest'),
          },
          {
            path: ':mtn/:action',
            lazy: () => import('./features/manifestDetails'),
          },
        ],
      },
      {
        path: '/about',
        element: <Help />,
      },
      {
        path: '/coming-soon',
        lazy: () => import('./features/comingSoon'),
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
