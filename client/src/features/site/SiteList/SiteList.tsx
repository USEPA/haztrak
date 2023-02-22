import { HtCard, HtDropdown, HtModal, HtTooltip } from 'components/Ht';
import useHtAPI from 'hooks/useHtAPI';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Site } from 'types/Handler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFileLines } from '@fortawesome/free-solid-svg-icons';

/**
 * Returns a table displaying the users sites.
 * @constructor
 */
function SiteList() {
  const [siteData, loading, error] = useHtAPI<Array<Site>>('trak/site/');
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (error) setShowErrorModal(true);
  }, [error]);

  const handleClose = () => {
    setShowErrorModal(false);
  };

  // ToDo: This is POC source, It needs to be refactored desperately
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
                    <HtTooltip text={`${site.name} Details`}>
                      <Link
                        to={`/site/${site.handler.epaSiteId}`}
                        aria-label={`${site.name}Details`}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </Link>
                    </HtTooltip>
                    <HtTooltip text={`${site.name}'s manifest`}>
                      <Link
                        to={`/site/${site.handler.epaSiteId}/manifest`}
                        aria-label={`${site.name}Manifests`}
                      >
                        <FontAwesomeIcon icon={faFileLines} />
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
          {loading && !error ? (
            <HtCard.Spinner message="Loading your sites..." />
          ) : //  else check if siteData is present
          siteData ? (
            // if yes, display the table
            SitesTable()
          ) : // else check if there's an error
          error ? (
            <>
              <HtModal showModal={showErrorModal} handleClose={handleClose}>
                <HtModal.Header closeButton>
                  <HtModal.Title style={{ color: 'red' }} title="Error retrieving site list" />
                </HtModal.Header>
                <HtModal.Body>
                  <p style={{ color: 'red' }}>
                    Something went wrong. Please try again sometime later
                  </p>
                </HtModal.Body>
              </HtModal>
              {SitesTable()}
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
