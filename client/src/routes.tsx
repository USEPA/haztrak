import { Root } from 'components/Layout/Root';
import { Login } from 'features/login';
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
