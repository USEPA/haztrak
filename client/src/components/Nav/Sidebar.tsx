import React, { ReactElement, useState } from 'react';
import { Button, Collapse } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from 'store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faArrowUpRightFromSquare,
  faCircleInfo,
  faFile,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';

/**
 * Vertical sidebar for navigation that disappears when the viewport is small
 * @returns {ReactElement|null}
 * @constructor
 */
function Sidebar(): ReactElement | null {
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
              <FontAwesomeIcon icon={faAngleDown} />
              Dashboard
            </Link>
            <Button
              className="bg-dark border-0 nav-link shadow-none"
              onClick={() => setSiteNav(!siteNav)}
              aria-controls="collapseSite"
              aria-expanded={siteNav}
            >
              <i className="sb-nav-link-icon text-primary fa-solid fa-map-location-dot" />
              <FontAwesomeIcon icon={faAngleDown} />
              Sites
              <div
                className={`sb-sidenav-collapse-arrow ${
                  siteNav ? '' : 'rotate-90-cc'
                } `}
              >
                <FontAwesomeIcon icon={faAngleDown} />
              </div>
            </Button>
            <Collapse in={siteNav}>
              <div id="collapseSite">
                <nav
                  className="sb-sidenav-menu-nested nav accordion"
                  id="sidenavAccordionPages"
                >
                  <Link className="nav-link" to="/site">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="text-info sb-nav-link-icon"
                    />{' '}
                    My Sites
                  </Link>
                  <a
                    className="nav-link"
                    target="_blank"
                    href="https://rcrainfopreprod.epa.gov"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon
                      icon={faArrowUpRightFromSquare}
                      className="text-danger sb-nav-link-icon"
                    />{' '}
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
              <FontAwesomeIcon
                icon={faCircleInfo}
                className="text-primary sb-nav-link-icon"
              />
              Help
              <div
                className={`sb-sidenav-collapse-arrow ${
                  helpNav ? '' : 'rotate-90-cc'
                } `}
              >
                <FontAwesomeIcon icon={faAngleDown} />
              </div>
            </Button>
            <Collapse in={helpNav}>
              <div id="collapseHelp">
                <nav
                  className="sb-sidenav-menu-nested nav accordion"
                  id="sidenavAccordionPages"
                >
                  <Link className="nav-link" to="/about">
                    <FontAwesomeIcon
                      icon={faFile}
                      className="text-primary sb-nav-link-icon"
                    />{' '}
                    About
                  </Link>
                  <a
                    className="nav-link"
                    target="_blank"
                    href={`${process.env.REACT_APP_HT_API_URL}/api/schema/swagger-ui`}
                    rel="noreferrer"
                  >
                    <i className="sb-nav-link-icon text-primary fa-solid fa-network-wired" />
                    <FontAwesomeIcon icon={faAngleDown} />
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
