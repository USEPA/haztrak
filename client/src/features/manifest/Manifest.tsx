import { ManifestDetails } from './ManifestDetails';
import { ManifestList } from 'features/manifest/ManifestList';
import { ManifestNew } from './ManifestNew';
import React, { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';

export function Manifest(): ReactElement {
  return (
    <Container fluid className="py-2">
      <Routes>
        <Route path="" element={<ManifestList />} />
        <Route path="new" element={<ManifestNew />} />
        <Route path=":mtn/:action" element={<ManifestDetails />} />
      </Routes>
    </Container>
  );
}
