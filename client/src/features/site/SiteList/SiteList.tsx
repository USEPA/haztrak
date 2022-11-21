import React, { useEffect, useState } from 'react';
import api from 'services';
import HtCard from 'components/HtCard';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import HtDropdown from 'components/HtDropdown';

interface props {
  user: any;
}

// interface SiteData {}

function SiteList(props: props) {
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get('trak/site', null)
      .then((response) => {
        if (response.length > 0) {
          setLoading(false);
          setSiteData(response as any);
        }
      })
      .catch(setError);
  }, [props.user]);

  function SitesTable() {
    return (
      <Table striped hover>
        <thead>
          <tr>
            <th>Site Alias</th>
            <th>EPA ID number</th>
            <th style={{ width: '10%' }}></th>
            <th style={{ width: '10%' }}></th>
          </tr>
        </thead>
        <tbody>
          {/*// @ts-ignore */}
          {siteData.map((site, i) => {
            return (
              <tr key={i}>
                <td>{site.name}</td>
                <td>{site.siteHandler.epaSiteId}</td>
                <td>
                  <Link to={`/site/${site.siteHandler.epaSiteId}`}>
                    <i className="fa-solid fa-eye"></i>
                  </Link>
                </td>
                <td>
                  <Link to={`/site/${site.siteHandler.epaSiteId}/manifests`}>
                    <i className="fa-solid fa-file-lines"></i>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }

  return (
    <>
      <HtCard>
        <HtCard.Header title="My Sites">
          <HtDropdown
            keyName="mySitesDropdown"
            links={[
              { name: 'hello', path: '#/hello' },
              { name: 'blah', path: '#/blah' },
            ]}
          />
        </HtCard.Header>
        <HtCard.Body>
          {/* if loading, show HtCard spinner component*/}
          {loading ? (
            <HtCard.Spinner message="Loading your sites..." />
          ) : //  else check if siteData is present
          siteData ? (
            // if yes, display the table
            SitesTable()
          ) : // else check if there's an error
          error ? (
            // if error exist, display it
            <>
              <p>Sorry, we experienced a error fetching your sites</p>
              <p>{error}</p>
            </>
          ) : (
            // lastly, if no error but siteData is empty, suggest
            // they add a site they have access to in their profile
            <div className="text-muted text-center">
              <p>No sites to display</p>
              <p>
                Add sites to your <Link to="/profile">Profile</Link>
              </p>
            </div>
          )}
        </HtCard.Body>
      </HtCard>
    </>
  );
}

export default SiteList;
