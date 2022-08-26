import React from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { Container } from 'react-bootstrap';
import history from './utils';
import PrivateRoute from './components/PrivateRoute';
import Home from './features/home';

import Login from './features/login';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import About from './features/About';
import Profile from './features/profile/Profile';
import Sites from './features/Site/Sites';
import SiteDetails from './features/Site/SiteDetails';
import SiteManifests from './features/Site/SiteManifests/SiteManifests';
import { useSelector } from 'react-redux';
import Manifest from './features/Manifest';

function App() {
  // init custom history object to allow navigation from
  // anywhere in the React app (inside or outside components)
  history.navigate = useNavigate();
  history.location = useLocation();

  const { user } = useSelector((state) => state.user);

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div className="App">
      <TopNav />
      <div id="layoutSidenav">
        <Sidebar />
        <Container fluid className="" id="layoutSidenav_content">
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/site/*"
              element={
                <PrivateRoute>
                  <Sites user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path="/manifest/*"
              element={
                <PrivateRoute>
                  <Manifest />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Container>
      </div>
    </div>
  );
}

export default App;
