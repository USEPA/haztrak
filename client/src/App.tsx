import React, { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Container } from 'react-bootstrap';
import PrivateRoute from 'components/PrivateRoute';
import Home from 'features/home';
import Login from 'features/login';
import { Sidebar, TopNav } from 'components/Nav';
import About from 'features/help';
import Profile from 'features/profile';
import Sites from 'features/site/Sites';
import { useAppSelector } from 'redux/hooks';
import Manifest from 'features/manifest';
import ErrorBoundary from 'components/ErrorBoundary';
import { RootState } from './redux/store';
import HtError from './components/HtError';

function App(): ReactElement {
  const { user } = useAppSelector((state: RootState) => state.user);

  return (
    <div className="App">
      <TopNav />
      <div id="layoutSidenav">
        <Sidebar />
        <Container fluid id="layoutSidenav_content">
          <ErrorBoundary>
            <Routes>
              <Route
                path="/"
                element={
                  <PrivateRoute authUser={user}>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute authUser={user}>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/site/*"
                element={
                  <PrivateRoute authUser={user}>
                    <Sites user={user ? user : ''} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/manifest/*"
                element={
                  <PrivateRoute authUser={user}>
                    <Manifest />
                  </PrivateRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<HtError httpError={404} />} />
            </Routes>
          </ErrorBoundary>
        </Container>
      </div>
    </div>
  );
}

export default App;
