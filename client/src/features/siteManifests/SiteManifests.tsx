import React from 'react';
import { useParams } from 'react-router-dom';

function SiteManifests() {
  let params = useParams();
  console.log(params);
  return (
    <>
      <p>hello there</p>
      <p>how are you today?</p>
    </>
  );
}

export default SiteManifests;
