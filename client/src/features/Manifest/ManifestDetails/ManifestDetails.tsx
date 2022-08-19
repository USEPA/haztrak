import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import api from '../../../services';
import {sleepDemo} from '../../../utils/utils';

function ManifestDetails(): JSX.Element {
  let params = useParams();
  const [manifestData, setManifestData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`trak/site/${params.siteId}`, null)
      .then((response) => {
        // Begin HT Example
        // sleepDemo illustrates how HT handles async hydration
        sleepDemo(750).then(() => setLoading(false));
        // setLoading(false)
        // End HT Example
        setManifestData(response as any);
      })
      .catch(setError);
  }, [params.siteId]);

  return <p>Manifest Details</p>;
}

export default ManifestDetails;
