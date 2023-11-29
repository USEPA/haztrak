import { faArrowRightFromBracket, faBars, faGear, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from 'assets/haztrak-logos/haztrak-logo-zip-file/svg/logo-no-background.svg';
import { NavContext, NavContextProps } from 'components/Layout/Root';
import React, { useContext } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from 'store';

interface TopNavProps {
  showSidebar: boolean;
  onSidebarToggle: (show: boolean) => void;
}

export function TopNav() {
  const { showSidebar, setShowSidebar } = useContext<NavContextProps>(NavContext);
  const authUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const logout = () => {
    dispatch({ type: 'user/logout' });
    navigation('/login');
  };
  if (!authUser) return null;

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // noinspection JSValidateTypes
  return (
    <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark d-flex">
      <div className="flex-grow-1">
        <Button
          aria-label="toggleSidebarNavigation"
          aria-hidden={false}
          id="sidebarToggle"
          onClick={toggleSidebar}
          variant="dark"
          className="mx-3 rounded-circle btn-hover-dark"
        >
          <FontAwesomeIcon icon={faBars} />
        </Button>
        <Link to="/" className="navbar-brand ps-3 pe-5">
          <img
            src={logo}
            alt="haztrak logo, hazardous waste tracking made easy."
            width={125}
            height={'auto'}
            className="my-3"
          />
        </Link>
      </div>
      <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4 btn-hover-dark rounded-circle">
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