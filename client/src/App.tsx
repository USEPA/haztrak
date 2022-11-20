import React from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { Container } from 'react-bootstrap';
import history from 'utils';
import PrivateRoute from 'components/PrivateRoute';
import Home from 'features/home';
import Login from 'features/login';
import { TopNav } from 'components/Nav';
import { Sidebar } from 'components/Nav';
import About from 'features/help';
import Profile from 'features/profile';
import Sites from 'features/site/Sites';
import { useAppSelector } from 'app/hooks';
import Manifest from 'features/manifest';
import ErrorBoundary from 'components/ErrorBoundary';
import { RootState } from './app/store';

function App() {
  const useSelector = useAppSelector;
  // Todo: remove this
  // init custom history object to allow navigation from
  // anywhere in the React app (inside or outside components)
  // @ts-ignore
  history.navigate = useNavigate();
  // @ts-ignore
  history.location = useLocation();

  const { user } = useSelector((state: RootState) => state.user);

  return (
    // eslint-disable-next-line react/jsx-filename-extension
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
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </ErrorBoundary>
        </Container>
      </div>
    </div>
  );
}

export default App;
