import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

export default [
  route('/', './features/privateRoute/index.ts', [
    layout('./features/layout/index.ts', [
      index('./features/dashboard/index.ts'),
      route('/profile', './features/profile/index.ts'),
      route('/organization', './features/org/index.ts'),
      ...prefix('/site', [
        index('./features/siteList/index.ts'),
        ...prefix('/:siteId', [
          index('./features/siteDetails/index.ts'),
          ...prefix('/manifest', [
            index('./features/manifestList/index.ts', { id: 'siteManifestList' }),
            route('/new', './features/newManifest/index.ts', { id: 'siteManifestNew' }),
            route('/:mtn/:action', './features/manifestDetails/index.ts', {
              id: 'siteManifestDetails',
            }),
          ]),
        ]),
      ]),
      ...prefix('/manifest', [
        index('./features/manifestList/index.ts'),
        route('/new', './features/newManifest/index.ts'),
        route('/:mtn/:action', './features/manifestDetails/index.ts'),
      ]),
    ]),
  ]),
  route('login', './features/login/index.ts'),
  route('register', './features/register/index.ts'),
  route('about', './features/about/index.ts'),
  route('*', './features/errorPage/index.ts'),
] satisfies RouteConfig;
