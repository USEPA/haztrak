import { ErrorBoundary } from 'components/Error';
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export function Root() {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <div className="App">
      <PrivateRoute>
        <TopNav showSidebar={showSidebar} onSidebarToggle={setShowSidebar} />
        <Sidebar show={showSidebar} onHide={setShowSidebar} />
        <Container fluid>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </Container>
      </PrivateRoute>
    </div>
  );
}
