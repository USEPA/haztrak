import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Collapse } from 'react-bootstrap';
import Fade from 'react-bootstrap/Fade';

function Help() {
    const [helpNav, setHelpNav] = useState(false);

  return (
    <>
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
                  >
                    <i className="sb-nav-link-icon text-primary fa-solid fa-network-wired" />
                    Swagger UI
                  </a>
                </nav>
              </div>
            </Collapse>
    </>
  );
}

export default Help;
