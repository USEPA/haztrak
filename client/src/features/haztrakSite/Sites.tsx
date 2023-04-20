import { Manifest } from 'features/manifest';
import React, { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SiteList } from './SiteList';
import { SiteDetails } from './SiteDetails';

interface Props {
  user: string;
}

/**
 * Request and display a list of site a user has access to
 * @constructor
 */
export function Sites({ user }: Props): ReactElement {
  return (
    <>
      <Routes>
        <Route path="/" element={<SiteList />} />
        <Route path=":siteId" element={<SiteDetails />} />
        <Route path=":siteId/manifest/*" element={<Manifest />} />
      </Routes>
    </>
  );
}
