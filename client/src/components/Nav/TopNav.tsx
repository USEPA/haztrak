import React from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import Notification from 'components/Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRightFromBracket,
  faBars,
  faGear,
  faTruckFast,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

function TopNav() {
  const authUser = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const logout = () => {
    dispatch({ type: 'user/logout' });
    navigation('/login');
  };
  if (!authUser) return null;

  const toggleSidebar = () => {
    document.body.classList.toggle('sb-sidenav-toggled');
  };

  // noinspection JSValidateTypes
  return (
    <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark d-flex">
      <div className="flex-grow-1 ps-2">
        <Link to="/" className="navbar-brand ps-3 pe-5">
          <FontAwesomeIcon icon={faTruckFast} className="pe-2" />
          Haztrak
        </Link>
        <Button
          aria-label="toggleSidebarNavigation"
          aria-hidden={false}
          id="sidebarToggle"
          onClick={toggleSidebar}
          className="ms-5 btn-link btn btn-sm bg-transparent btn-outline-none btn-outline-dark"
        >
          <FontAwesomeIcon icon={faBars} />
        </Button>
      </div>
      <Notification />
      <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
        <li className="nav-item dropdown">
          <Dropdown>
            <Dropdown.Toggle
              aria-label="userProfileDropDown"
              aria-hidden={false}
              id="navbarDropdown"
              className="nav-link bg-transparent btn-dark btn-outline-none"
            >
              <FontAwesomeIcon icon={faUser} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="settings/">
                <FontAwesomeIcon icon={faGear} className="pe-2 text-primary" />
                Settings
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="profile/">
                <FontAwesomeIcon icon={faUser} className="pe-2 text-primary" />
                Profile
              </Dropdown.Item>
              <hr className="dropdown-divider" />
              <Dropdown.Item onClick={logout}>
                <FontAwesomeIcon icon={faArrowRightFromBracket} className="pe-2 text-danger" />
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
