import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  route('/', './features/privateRoute/index.ts', [
    layout('./features/layout/index.ts', [index('./features/dashboard/index.ts')]),
  ]),
  route('login', './features/login/index.ts'),
  route('register', './features/register/index.ts'),
  route('about', './features/about/index.ts'),
  route('*', './features/errorPage/index.ts'),
] satisfies RouteConfig;
