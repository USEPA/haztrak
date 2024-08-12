import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ErrorPage } from '~/features/ErrorPage/ErrorPage';
import { Login } from '~/features/login';
import { orgsLoader } from '~/features/org';

const Dashboard = () => import('~/features/dashboard');
const Profile = () => import('~/features/profile');
const SiteList = () => import('~/features/SiteList');
const SiteDetails = () => import('~/features/SiteDetails');
const Help = () => import('~/features/about');
const Org = () => import('~/features/org');
const PrivateRoute = () => import('~/features/PrivateRoute');
const RegisterHero = () => import('~/features/register');
const ManifestList = () => import('~/features/ManifestList');
const ManifestDetails = () => import('~/features/ManifestDetails');
const NewManifest = () => import('~/features/NewManifest');
const Layout = () => import('./components/Layout');

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    lazy: RegisterHero,
  },
  {
    path: '',
    lazy: PrivateRoute,
    children: [
      {
        path: '/',
        lazy: Layout,
        children: [
          {
            path: '',
            lazy: Org,
            loader: orgsLoader,
            children: [
              {
                path: '',
                lazy: Dashboard,
              },
              {
                path: '/profile',
                lazy: Profile,
              },
              {
                path: '/site',
                children: [
                  {
                    path: '',
                    lazy: SiteList,
                  },
                  {
                    path: ':siteId',
                    lazy: SiteDetails,
                  },
                  {
                    path: ':siteId/manifest',
                    children: [
                      {
                        path: '',
                        lazy: ManifestList,
                      },
                      {
                        path: 'new',
                        lazy: NewManifest,
                      },
                      {
                        path: ':mtn/:action',
                        lazy: ManifestDetails,
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
                lazy: ManifestList,
              },
              {
                path: 'new',
                lazy: NewManifest,
              },
              {
                path: ':mtn/:action',
                lazy: ManifestDetails,
              },
            ],
          },
          {
            path: '/about',
            lazy: Help,
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
