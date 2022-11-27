import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Collapse } from 'react-bootstrap';
import { RootState } from 'redux/store';

/**
 * Vertical sidebar for navigation that disappears when the viewport is small
 * @returns {JSX.Element|null}
 * @constructor
 */
function Sidebar() {
  const [siteNav, setSiteNav] = useState(false);
  const [helpNav, setHelpNav] = useState(false);

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
              onClick={() => setSiteNav(!siteNav)}
              aria-controls="collapseSite"
              aria-expanded={siteNav}
            >
              <i className="sb-nav-link-icon text-primary fa-solid fa-map-location-dot" />
              Sites
              <div
                className={`sb-sidenav-collapse-arrow ${
                  siteNav ? '' : 'rotate-90-cc'
                } `}
              >
                <i className="fas fa-angle-down" />
              </div>
            </Button>
            <Collapse in={siteNav}>
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
                    target="_blank"
                    href="https://rcrainfopreprod.epa.gov"
                    rel="noreferrer"
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
            <Button
              className="bg-dark border-0 nav-link shadow-none"
              onClick={() => setHelpNav(!helpNav)}
              aria-controls="collapseHelp"
              aria-expanded={helpNav}
            >
              <i className="sb-nav-link-icon text-primary fa-solid fa-circle-info" />
              Help
              <div
                className={`sb-sidenav-collapse-arrow ${
                  helpNav ? '' : 'rotate-90-cc'
                } `}
              >
                <i className="fas fa-angle-down" />
              </div>
            </Button>
            <Collapse in={helpNav}>
              <div id="collapseHelp">
                <nav
                  className="sb-sidenav-menu-nested nav accordion"
                  id="sidenavAccordionPages"
                >
                  <Link className="nav-link" to="/about">
                    <i className="sb-nav-link-icon text-primary fa-regular fa-file"></i>
                    About
                  </Link>
                  <a
                    className="nav-link"
                    target="_blank"
                    href={`${process.env.REACT_APP_HT_API_URL}/api/schema/swagger-ui`}
                    rel="noreferrer"
                  >
                    <i className="sb-nav-link-icon text-primary fa-solid fa-network-wired" />
                    Swagger UI
                  </a>
                </nav>
              </div>
            </Collapse>
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
