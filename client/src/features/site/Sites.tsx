import React, { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import SiteList from './SiteList';
import SiteDetails from './SiteDetails';
import SiteManifests from './SiteManifests';
import useTitle from '../../hooks/useTitle';

interface Props {
  user: string;
}

/**
 * Request and display a list of site a user has access to
 * @constructor
 */
function Sites({ user }: Props): ReactElement {
  useTitle('Site');
  return (
    <Routes>
      <Route path="/" element={<SiteList />} />
      <Route path=":siteId" element={<SiteDetails />} />
      <Route path=":siteId/manifests" element={<SiteManifests />} />
    </Routes>
  );
}

export default Sites;
