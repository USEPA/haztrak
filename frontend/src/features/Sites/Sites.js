import React, { useEffect } from 'react';
import HtCard from '../../components/HtCard';
import { Table } from 'react-bootstrap';
import api from '../../services';
import { Link } from 'react-router-dom';
import SiteActions from './ActionDropdown';

function Sites(props) {
  const [siteData, setSiteData] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get('trak/site', null)
      .then((response) => {
        if (response.length > 0) {
          sleep(200);
          setSiteData(response);
        }
      })
      .then(() => setLoading(false))
      .catch(setError);
  }, [props.user]);

  function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

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
          <SiteActions />
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
            <p>Sorry, we experienced a error fetching your sites</p>
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

export default Sites;
