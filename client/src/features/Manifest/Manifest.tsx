import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ManifestDetails from './ManifestDetails/ManifestDetails';
import ManifestEdit from './ManifestEdit';

function Manifest(): JSX.Element {
  return (
    <Routes>
      <Route path=":mtn/view" element={<ManifestDetails />} />
      <Route path=":mtn/edit" element={<ManifestEdit />} />
    </Routes>
  );
}

export default Manifest;
