import React from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'app/store';

function TopNav() {
  const authUser = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const logout = () => dispatch({ type: 'user/logout' });
  if (!authUser) return null;

  const toggleSidebar = () => {
    document.body.classList.toggle('sb-sidenav-toggled');
  };

  // noinspection JSValidateTypes
  return (
    <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark d-flex">
      <div className="flex-grow-1 ps-2">
        <Link to="/" className="navbar-brand ps-3 pe-5">
          <i className="fa-solid fa-truck-fast pe-2" />
          Haztrak
        </Link>
        <Button
          id="sidebarToggle"
          onClick={toggleSidebar}
          className="ms-5 btn-link btn btn-sm bg-transparent btn-outline-none btn-outline-dark"
        >
          <i className="fas fa-bars" />
        </Button>
      </div>
      <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
        <li className="nav-item dropdown">
          <Dropdown>
            <Dropdown.Toggle
              id="navbarDropdown"
              className="nav-link bg-transparent btn-dark btn-outline-none"
            >
              <i className="fas fa-user fa-fw" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="settings/">
                <i className="text-primary fa-solid fa-gear pe-2" />
                Settings
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="profile/">
                <i className="text-primary fa-solid fa-user pe-2" />
                Profile
              </Dropdown.Item>
              <hr className="dropdown-divider" />
              <Dropdown.Item onClick={logout}>
                <i className="text-danger fa-solid fa-arrow-right-from-bracket pe-2" />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </li>
      </ul>
    </nav>
  );
}

export default TopNav;
