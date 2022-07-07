import React from "react";
import {Button, Dropdown} from "react-bootstrap";
import {Link} from "react-router-dom";
import {authActions} from '_store';
import {useDispatch, useSelector} from 'react-redux';

const TopNav = () => {
  const authUser = useSelector(x => x.auth.user);
  const dispatch = useDispatch();
  const logout = () => dispatch(authActions.logout());
  if (!authUser) return null;

  function toggleSidebar() {
    document.body.classList.toggle('sb-sidenav-toggled')
  }

  return (
    <nav
      className="sb-topnav navbar navbar-expand navbar-dark bg-dark d-flex">
      <div className="flex-grow-1 ps-2">
        <Link to="/" className="navbar-brand ps-3 pe-5">
          <i className="fa-solid fa-truck-fast pe-2"></i>
          Haztrak
        </Link>
        <Button id="sidebarToggle" onClick={toggleSidebar}
                className="ms-5 btn-link btn btn-sm bg-transparent btn-outline-none btn-outline-dark">
          <i className="fas fa-bars"></i>
        </Button>
      </div>
      <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
        <li className="nav-item dropdown">
          <Dropdown>
            <Dropdown.Toggle id="navbarDropdown"
                             className="nav-link bg-transparent btn-dark btn-outline-none">
              <i className="fas fa-user fa-fw"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>
                <Link to="/settings"
                      className="text-reset text-decoration-none">
                  <i className="text-primary fa-solid fa-gear pe-2"></i>
                  Settings
                </Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link to="/profile"
                      className="text-reset text-decoration-none">
                  <i className="text-primary fa-solid fa-user pe-2"></i>
                  Profile
                </Link>
              </Dropdown.Item>
              <hr className="dropdown-divider"/>
              <Dropdown.Item>
                <Link onClick={logout} to="login/"
                      className="text-reset text-decoration-none">
                  <i
                    className="text-danger fa-solid fa-arrow-right-from-bracket pe-2"></i>
                  Logout
                </Link>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </li>
      </ul>
    </nav>
  )
}

export default TopNav
