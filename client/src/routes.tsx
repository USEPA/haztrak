import { Root } from 'components/Layout/Root';
import { Login } from 'features/login';
import { ManifestDetails } from 'features/manifest/ManifestDetails';
import { ManifestList } from 'features/manifest/ManifestList';
import { NewManifest } from 'features/manifest/NewManifest';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        lazy: () => import('./features/home'),
      },
      {
        path: '/notifications',
        lazy: () => import('./features/notifications'),
      },
      {
        path: '/profile',
        lazy: () => import('./features/profile'),
      },
      {
        path: '/site',
        children: [
          {
            path: '',
            // element: <SiteList />,
            lazy: () => import('./features/SiteList'),
          },
          {
            path: ':siteId',
            // element: <SiteDetails />,
            lazy: () => import('./features/SiteDetails'),
          },
          {
            path: ':siteId/manifest',
            children: [
              {
                path: '',
                element: <ManifestList />,
              },
              {
                path: 'new',
                element: <NewManifest />,
              },
              {
                path: ':mtn/:action',
                element: <ManifestDetails />,
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
            element: <ManifestList />,
          },
          {
            path: 'new',
            element: <NewManifest />,
          },
          {
            path: ':mtn/:action',
            element: <ManifestDetails />,
          },
        ],
      },
      {
        path: '/about',
        lazy: () => import('./features/help'),
      },
      {
        path: '/coming-soon',
        lazy: () => import('./features/comingSoon'),
      },
      {
        path: '*',
        lazy: () => import('./features/404'),
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);
