import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Help from './Core/Help';
import Sites from './Core/Sites';
import { Button, Collapse } from 'react-bootstrap';
import { RootState } from 'app/store';

/**
 * Vertical sidebar for navigation that disappears when the viewport is small
 * @returns {JSX.Element|null}
 * @constructor
 */
function Sidebar() {
 

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
           <Sites />
            <div className="sb-sidenav-menu-heading">Core</div>
            <Help />
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
