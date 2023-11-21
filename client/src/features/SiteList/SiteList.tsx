import { HaztrakSite, HtSiteTable } from 'components/HaztrakSite';
import { HtCard, HtModal } from 'components/Ht';
import { useHtApi } from 'hooks';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Returns a table displaying the Haztrak sites a user has access to.
 * @constructor
 */
export function SiteList() {
  const [siteData, loading, error] = useHtApi<Array<HaztrakSite>>('site');
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
        <HtCard.Header title="My Sites" />
        <HtCard.Body>
          {loading && !error ? (
            <HtCard.Spinner message="Loading your sites..." />
          ) : siteData ? (
            <HtSiteTable sitesData={siteData} />
          ) : error ? (
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
