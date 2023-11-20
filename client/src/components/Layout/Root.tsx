import { ErrorBoundary } from 'components/ErrorBoundary';
import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export function Root() {
  return (
    <div className="App">
      <PrivateRoute>
        <TopNav />
        <div id="layoutSidenav">
          <Sidebar />

          <Container fluid id="layoutSidenav_content">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </Container>
        </div>
      </PrivateRoute>
    </div>
  );
}
