import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ManifestDetails from './ManifestDetails/ManifestDetails';
import ManifestEdit from './ManifestEdit';
import {Container} from 'react-bootstrap';

function Manifest(): JSX.Element {
  return (
    <Container className="py-2">
      <Routes>
        <Route path=":mtn/view" element={<ManifestDetails/>}/>
        <Route path=":mtn/edit" element={<ManifestEdit/>}/>
      </Routes>
    </Container>
  );
}

export default Manifest;
