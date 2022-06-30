import React from "react";

const Sidebar = () => {
  return (
    <div id="layoutSidenav_nav">
      <nav className="sb-sidenav accordion sb-sidenav-dark"
           id="sidenavAccordion">
        <div className="sb-sidenav-menu">
          <div className="nav">
            <div className="sb-sidenav-menu-heading">Apps</div>
            <a className="nav-link" href="#">
              <div className="sb-nav-link-icon"><i
                className="fas fa-tachometer-alt"></i></div>
              Dashboard
            </a>
            <a className="nav-link collapsed" href="#"
               data-bs-toggle="collapse" data-bs-target="#collapsePages"
               aria-expanded="false" aria-controls="collapsePages">
              <div className="sb-nav-link-icon">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              Sites
              <div className="sb-sidenav-collapse-arrow">
                <i className="fas fa-angle-down"></i>
              </div>
            </a>
            <div className="collapse" id="collapsePages"
                 aria-labelledby="headingTwo"
                 data-bs-parent="#sidenavAccordion">
              <nav className="sb-sidenav-menu-nested nav accordion"
                   id="sidenavAccordionPages">
                <a className="nav-link" href="#">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-location-pin"></i>
                  </div>
                  My Sites
                </a>
                <a className="nav-link" href="https://rcrainfopreprod.epa.gov">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  </div>
                  RCRAInfo
                </a>
              </nav>
            </div>
            <div className="sb-sidenav-menu-heading">Core</div>
            <a className="nav-link" href="#">
              <div className="sb-nav-link-icon">
                <i className="fa-solid fa-circle-info"></i>
              </div>
              About
            </a>
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
