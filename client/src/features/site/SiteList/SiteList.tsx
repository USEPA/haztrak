import HtCard from 'components/HtCard';
import HtDropdown from 'components/HtDropdown';
import HtTooltip from 'components/HtTooltip';
import useHtAPI from 'hooks/useHtAPI';
import React from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Site } from 'types/Handler';

function SiteList() {
  const [siteData, loading, error] = useHtAPI<Array<Site>>('trak/site/');

  function SitesTable() {
    return (
      <Table striped hover>
        <thead>
          <tr>
            <th>Site Alias</th>
            <th>EPA ID number</th>
            <th className="d-grid justify-content-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {siteData ? (
            siteData.map((site, i) => {
              return (
                <tr key={i}>
                  <td>{site.name}</td>
                  <td>{site.handler.epaSiteId}</td>
                  <td className="d-flex justify-content-evenly">
                    <HtTooltip text={'Site Details'}>
                      <Link to={`/site/${site.handler.epaSiteId}`}>
                        <i className="fa-solid fa-eye"></i>
                      </Link>
                    </HtTooltip>
                    <HtTooltip text={`${site.name}'s manifest`}>
                      <Link to={`/site/${site.handler.epaSiteId}/manifests`}>
                        <i className="fa-solid fa-file-lines"></i>
                      </Link>
                    </HtTooltip>
                  </td>
                </tr>
              );
            })
          ) : (
            <p>nothing</p>
          )}
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
            <>
              <p>Sorry, we experienced a error fetching your sites</p>
              <p>{error.message}</p>
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
