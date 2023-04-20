import { HtCard, HtDropdown, HtModal } from 'components/Ht';
import { useHtAPI } from 'hooks';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HaztrakSite, HtSiteTable } from 'components/HaztrakSite';

/**
 * Returns a table displaying the Haztrak sites a user has access to.
 * @constructor
 */
export function SiteList() {
  const [siteData, loading, error] = useHtAPI<Array<HaztrakSite>>('site/');
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (error) setShowErrorModal(true);
  }, [error]);

  const handleClose = () => {
    setShowErrorModal(false);
  };

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
            <HtSiteTable sitesData={siteData} />
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
