import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Collapse } from 'react-bootstrap';
import Fade from 'react-bootstrap/Fade';

function Sites() {
    const [siteNav, setSiteNav] = useState(false);
   

  return (
    <>
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
    </>
  );
}

export default Sites;
