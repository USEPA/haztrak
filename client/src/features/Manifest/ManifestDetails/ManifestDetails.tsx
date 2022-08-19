import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import api from '../../../services';
import {sleepDemo} from '../../../utils/utils';

interface Manifest {
  manifestTrackingNumber: string;
}

function ManifestDetails(): JSX.Element {
  let params = useParams();
  const [manifestData, setManifestData] = useState<Manifest | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`trak/manifest/${params.mtn}`, null)
      .then((response) => {
        // Begin HT Example
        // sleepDemo illustrates how HT handles async hydration
        sleepDemo(750).then(() => setLoading(false));
        // setLoading(false)
        // End HT Example
        setManifestData(response as Manifest);
        console.log(response);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [params.mtn]);

  return manifestData ? (
    <p>manifest data: {manifestData.manifestTrackingNumber}</p>
  ) : (
    <p>no manifest data {error ? 'error msg goes here' : ''}</p>
  );
}

export default ManifestDetails;
