import { ErrorBoundary } from 'components/ErrorBoundary';
import { Sidebar } from 'components/Nav/Sidebar';
import { TopNav } from 'components/Nav/TopNav';
import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

export function Root() {
  return (
    <div className="App">
      <TopNav />
      <div id="layoutSidenav">
        <Sidebar />
        <Container fluid id="layoutSidenav_content">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </Container>
      </div>
    </div>
  );
}
