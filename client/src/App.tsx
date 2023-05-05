import { ErrorBoundary } from 'components/ErrorBoundary';
import { HtCard } from 'components/Ht';
import { Sidebar, TopNav } from 'components/Nav';
import { PrivateRoute } from 'components/PrivateRoute';
import { About } from 'features/help';
import { Home } from 'features/home';
import { Login } from 'features/login';
import { Manifest } from 'features/manifest';
import { Notifications } from 'features/notifications';
import { Profile } from 'features/profile';
import { Sites } from 'features/haztrakSite';
import React, { ReactElement, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { RootState, useAppDispatch, useAppSelector } from 'store';
import './App.scss';
import { getProfile } from 'store/rcraProfileSlice';
import { RcraProfileState } from 'store/rcraProfileSlice/rcraProfile.slice';

function App(): ReactElement {
  const { user } = useAppSelector((state: RootState) => state.user);
  const profile = useAppSelector<RcraProfileState>((state) => state.rcraProfile);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  console.log('user', user);

  useEffect(() => {
    if (user) {
      dispatch(getProfile());
    }
  }, [profile.user]);

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
                path="/notifications"
                element={
                  <PrivateRoute authUser={user}>
                    <Notifications />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile/*"
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
              {/* If unknown route, display 404*/}
              <Route
                path="*"
                element={
                  <HtCard>
                    <HtCard.Header title="This is not the page you're looking for..." />
                    <HtCard.Body className="d-grid justify-content-center">
                      <h1 className="display-1 d-flex justify-content-center">404</h1>
                      <h4>Resource not found</h4>
                    </HtCard.Body>
                    <HtCard.Footer>
                      <Button onClick={() => navigate(-1)}>Return</Button>
                    </HtCard.Footer>
                  </HtCard>
                }
              />
            </Routes>
          </ErrorBoundary>
        </Container>
      </div>
    </div>
  );
}

export default App;
