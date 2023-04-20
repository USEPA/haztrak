import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { SideBarNavItem } from './SideBarNavItem';
import React, { ReactElement, useState } from 'react';
import { Button, Collapse } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from 'store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faArrowUpRightFromSquare,
  faCircleQuestion,
  faFileLines,
  faFolderOpen,
  faInfo,
  faLocationArrow,
  faLocationDot,
  faNetworkWired,
  faRecycle,
  faTachometerAlt,
} from '@fortawesome/free-solid-svg-icons';

/**
 * Vertical sidebar for navigation that disappears when the viewport is small
 * @returns {ReactElement|null}
 * @constructor
 */
export function Sidebar(): ReactElement | null {
  const [siteNav, setSiteNav] = useState(false);
  const [helpNav, setHelpNav] = useState(false);
  const [mtnNav, setMtnNav] = useState(false);

  const authUser = useSelector((state: RootState) => state.user.user);
  if (!authUser) return null;

  return (
    <div id="layoutSidenav_nav">
      <nav className="sb-sidenav accordion sb-sidenav-dark bs-primary" id="sidenavAccordion">
        <div className="sb-sidenav-menu">
          <div className="nav">
            <div className="sb-sidenav-menu-heading">Apps</div>
            <Link className="nav-link" to="/">
              <FontAwesomeIcon icon={faTachometerAlt} size="lg" className="me-2 text-primary" />
              Dashboard
            </Link>
            <Button
              className="bg-dark border-0 nav-link shadow-none"
              onClick={() => setSiteNav(!siteNav)}
              aria-controls="collapseSite"
              aria-expanded={siteNav}
            >
              <FontAwesomeIcon icon={faLocationArrow} size="lg" className="me-2 text-primary" />
              Sites
              <div className={`sb-sidenav-collapse-arrow ${siteNav ? '' : 'rotate-90-cc'} `}>
                <FontAwesomeIcon icon={faAngleDown} size="lg" />
              </div>
            </Button>
            <Collapse in={siteNav}>
              <div id="collapseSite">
                <nav className="sb-sidenav-menu-nested nav accordion" id="sidenavAccordionPages">
                  <SideBarNavItem to="/site" text="My Sites" icon={faLocationDot} />
                  <SideBarNavItem
                    to="https://rcrainfopreprod.epa.gov"
                    targetBlank={true}
                    icon={faRecycle}
                  >
                    <>
                      RCRAInfo{' '}
                      <FontAwesomeIcon
                        icon={faArrowUpRightFromSquare}
                        className="text-danger"
                        size="xs"
                      />
                    </>
                  </SideBarNavItem>
                </nav>
              </div>
            </Collapse>
            <Button
              className="bg-dark border-0 nav-link shadow-none"
              onClick={() => setMtnNav(!mtnNav)}
              aria-controls="collapseHelp"
              aria-expanded={mtnNav}
            >
              <FontAwesomeIcon icon={faFileLines} size="lg" className="text-primary me-2" />
              Manifests
              <div className={`sb-sidenav-collapse-arrow ${mtnNav ? '' : 'rotate-90-cc'} `}>
                <FontAwesomeIcon icon={faAngleDown} size="lg" />
              </div>
            </Button>
            <Collapse in={mtnNav}>
              <div id="collapseHelp">
                <nav className="sb-sidenav-menu-nested nav accordion" id="sidenavAccordionPages">
                  <SideBarNavItem to="/manifest" text="My Manifests" icon={faFolderOpen} />
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
              <FontAwesomeIcon icon={faInfo} size="lg" className="text-primary me-2" />
              Help
              <div className={`sb-sidenav-collapse-arrow ${helpNav ? '' : 'rotate-90-cc'} `}>
                <FontAwesomeIcon size="lg" icon={faAngleDown} />
              </div>
            </Button>
            <Collapse in={helpNav}>
              <div id="collapseHelp">
                <nav className="sb-sidenav-menu-nested nav accordion" id="sidenavAccordionPages">
                  <SideBarNavItem to="/about" text="About" icon={faCircleQuestion} />
                  <SideBarNavItem
                    to={`${process.env.REACT_APP_HT_API_URL}/api/schema/swagger-ui`}
                    targetBlank={true}
                    icon={faNetworkWired}
                  >
                    <>
                      OpenAPI Docs{' '}
                      <FontAwesomeIcon
                        icon={faArrowUpRightFromSquare}
                        className="text-danger"
                        size="xs"
                      />
                    </>
                  </SideBarNavItem>
                  <SideBarNavItem
                    to="https://github.com/USEPA/haztrak/issues"
                    targetBlank={true}
                    icon={faGithub}
                  >
                    <>
                      Report an Issue{' '}
                      <FontAwesomeIcon
                        icon={faArrowUpRightFromSquare}
                        className="text-danger"
                        size="xs"
                      />
                    </>
                  </SideBarNavItem>
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
