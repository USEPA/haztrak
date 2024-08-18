import { createBrowserRouter } from 'react-router-dom';
import { ErrorPage } from '~/features/errorPage/ErrorPage';
import { Login } from '~/features/login';

const Dashboard = () => import('~/features/dashboard');
const Profile = () => import('~/features/profile');
const SiteList = () => import('~/features/siteList');
const SiteDetails = () => import('~/features/siteDetails');
const About = () => import('~/features/about');
const Org = () => import('~/features/org');
const PrivateRoute = () => import('~/features/privateRoute');
const RegisterHero = () => import('~/features/register');
const ManifestList = () => import('~/features/manifestList');
const ManifestDetails = () => import('~/features/manifestDetails');
const NewManifest = () => import('~/features/newManifest');
const Layout = () => import('./components/Layout');

export const router = createBrowserRouter([
  {
    path: '/',
    lazy: PrivateRoute,
    children: [
      {
        path: '',
        lazy: Layout,
        children: [
          {
            path: '',
            lazy: Org,
            children: [
              {
                path: '',
                lazy: Dashboard,
              },
              {
                path: 'profile',
                lazy: Profile,
              },
              {
                path: 'site',
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
            path: 'manifest',
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
    path: 'login',
    element: <Login />,
  },
  {
    path: 'register',
    lazy: RegisterHero,
  },
  {
    path: 'about',
    lazy: About,
  },
  {
    path: '*',
    element: <ErrorPage code={404} />,
  },
]);
