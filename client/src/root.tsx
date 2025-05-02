import { ReactNode } from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { AppProvider } from '~/providers';
import './globals.css';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Hazardous waste tracking made easy" />
        <link rel="manifest" href="/manifest.json" />
        <title>Haztrak</title>
        <Meta />
        <Links />
      </head>
      <body className="tw-h-full tw-flex tw-flex-col">
        <noscript>You need to enable JavaScript to run this app.</noscript>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <AppProvider>
      <Outlet />;
    </AppProvider>
  );
}
