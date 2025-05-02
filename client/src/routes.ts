import { type RouteConfig, route } from '@react-router/dev/routes';

export default [
  route('/', './features/privateRoute/index.ts'),
  route('login', './features/login/index.ts'),
  route('register', './features/register/index.ts'),
  route('about', './features/about/index.ts'),
  route('*', './features/errorPage/index.ts'),
] satisfies RouteConfig;
