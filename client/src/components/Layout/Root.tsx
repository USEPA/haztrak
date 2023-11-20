import { ErrorBoundary } from 'components/ErrorBoundary';
import { AlertContainer } from 'components/Notification/AlertContainer';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { PrivateRoute } from './PrivateRoute';
import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

export function Root() {
  return (
    <div className="App">
      <PrivateRoute>
        <TopNav />
        <div id="layoutSidenav">
          <Sidebar />
          <Container fluid id="layoutSidenav_content">
            <ErrorBoundary>
              <AlertContainer />
              <Outlet />
            </ErrorBoundary>
          </Container>
        </div>
      </PrivateRoute>
    </div>
  );
}
