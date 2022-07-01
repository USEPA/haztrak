import React from "react";
import {Button, Dropdown} from "react-bootstrap";
import {Link} from "react-router-dom";

const TopNav = () => {

  function toggleSidebar() {
    console.log("hello")
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
              <Dropdown.Item href="#/action-1">
                <i className="fa-solid fa-gear pe-2"></i>
                Settings
              </Dropdown.Item>
              <Dropdown.Item href="#/action-2">
                <i className="fa-solid fa-user pe-2"></i>
                <Link to="/profile"
                      className="text-decoration-none text-reset">Profile</Link>
              </Dropdown.Item>
              <hr className="dropdown-divider"/>
              <Dropdown.Item href="#/action-3">Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </li>
      </ul>
    </nav>
  )
}

export default TopNav
