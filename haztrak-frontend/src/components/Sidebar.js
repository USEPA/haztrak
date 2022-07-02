import React from "react";
import {Link} from "react-router-dom";

const Sidebar = () => {
  return (
    <div id="layoutSidenav_nav">
      <nav className="sb-sidenav accordion sb-sidenav-dark bs-primary"
           id="sidenavAccordion">
        <div className="sb-sidenav-menu">
          <div className="nav">
            <div className="sb-sidenav-menu-heading">Apps</div>
            <Link className="nav-link" to="/">
              <i
                className="sb-nav-link-icon text-primary fas fa-tachometer-alt"></i>
              Dashboard
            </Link>
            <a className="nav-link collapsed" href="."
               data-bs-toggle="collapse" data-bs-target="#collapseSites"
               aria-expanded="false" aria-controls="collapseSites">
              <div className="sb-nav-link-icon">
                <i
                  className="sb-nav-link-icon text-primary fa-solid fa-map-location-dot"></i>
              </div>
              Sites
              <div className="sb-sidenav-collapse-arrow">
                <i className="fas fa-angle-down"></i>
              </div>
            </a>
            <div className="collapse" id="collapseSites"
                 aria-labelledby="headingTwo"
                 data-bs-parent="#sidenavAccordion">
              <nav className="sb-sidenav-menu-nested nav accordion"
                   id="sidenavAccordionPages">
                <Link className="nav-link" to="/sites">
                  <i
                    className="sb-nav-link-icon text-primary fa-solid fa-location-dot"></i>
                  My Sites
                </Link>
                <a className="nav-link"
                   href="https://rcrainfopreprod.epa.gov">
                  <i className="sb-nav-link-icon text-danger fa-solid
                    fa-arrow-up-right-from-square"></i>
                  RCRAInfo
                </a>
              </nav>
            </div>
            <div className="sb-sidenav-menu-heading">Core</div>
            <Link className="nav-link" to="/about">
              <i
                className="sb-nav-link-icon text-primary fa-solid fa-circle-info"></i>
              About
            </Link>
          </div>
        </div>
        <div className="sb-sidenav-footer">
          <div className="small">Logged in as:</div>
          Username 1
        </div>
      </nav>
    </div>
  )
}

export default Sidebar
