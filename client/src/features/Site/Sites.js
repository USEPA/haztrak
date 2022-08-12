import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SiteList from './SiteList';
import SiteDetails from './SiteDetails';
import SiteManifests from './SiteManifests';

/**
 * Request and display a list of Site a user has access to
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function Sites(props) {
  return (
    <Routes>
      <Route path="/" element={<SiteList user={null} />} />
      <Route path=":siteId" element={<SiteDetails />} />
      <Route path=":siteId/manifests" element={<SiteManifests />} />
    </Routes>
  );
}

export default Sites;
