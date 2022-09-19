import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Collapse } from 'react-bootstrap';
import { RootState } from 'app/store';

/**
 * Vertical sidebar for navigation that disappears when the viewport is small
 * @returns {JSX.Element|null}
 * @constructor
 */
function Sidebar() {
  const [open, setOpen] = useState(false);

  const authUser = useSelector((state: RootState) => state.user.user);
  if (!authUser) return null;

  return (
    <div id="layoutSidenav_nav">
      <nav
        className="sb-sidenav accordion sb-sidenav-dark bs-primary"
        id="sidenavAccordion"
      >
        <div className="sb-sidenav-menu">
          <div className="nav">
            <div className="sb-sidenav-menu-heading">Apps</div>
            <Link className="nav-link" to="/">
              <i className="sb-nav-link-icon text-primary fas fa-tachometer-alt" />
              Dashboard
            </Link>
            <Button
              className="bg-dark border-0 nav-link shadow-none"
              onClick={() => setOpen(!open)}
              aria-controls="collapseSite"
              aria-expanded={open}
            >
              <i className="sb-nav-link-icon text-primary fa-solid fa-map-location-dot" />
              Sites
              <div
                className={`sb-sidenav-collapse-arrow ${
                  open ? '' : 'rotate-90-cc'
                } `}
              >
                <i className="fas fa-angle-down" />
              </div>
            </Button>
            <Collapse in={open}>
              <div id="collapseSite">
                <nav
                  className="sb-sidenav-menu-nested nav accordion"
                  id="sidenavAccordionPages"
                >
                  <Link className="nav-link" to="/site">
                    <i className="sb-nav-link-icon text-primary fa-solid fa-location-dot" />
                    My Sites
                  </Link>
                  <a
                    className="nav-link"
                    href="https://rcrainfopreprod.epa.gov"
                  >
                    <i
                      className="sb-nav-link-icon text-danger fa-solid
                    fa-arrow-up-right-from-square"
                    />
                    RCRAInfo
                  </a>
                </nav>
              </div>
            </Collapse>
            <div className="sb-sidenav-menu-heading">Core</div>
            <Link className="nav-link" to="/about">
              <i className="sb-nav-link-icon text-primary fa-solid fa-circle-info" />
              About
            </Link>
          </div>
        </div>
        <div className="sb-sidenav-footer">
          <div className="small">Logged in as:</div>
          {authUser}
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
