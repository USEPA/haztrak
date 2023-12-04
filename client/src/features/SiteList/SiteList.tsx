import { HaztrakSite, SiteListGroup } from 'components/HaztrakSite';
import { HtCard, HtModal } from 'components/UI';
import { useHtApi, useTitle } from 'hooks';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Returns a table displaying the Haztrak sites a user has access to.
 * @constructor
 */
export function SiteList() {
  useTitle('Sites');
  const [siteData, loading, error] = useHtApi<Array<HaztrakSite>>('site');
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (error) setShowErrorModal(true);
  }, [error]);

  const handleClose = () => {
    setShowErrorModal(false);
  };

  return (
    <Container className="my-3">
      <HtCard title="My Sites">
        <HtCard.Body>
          {loading && !error ? (
            <HtCard.Spinner message="Loading your sites..." />
          ) : siteData ? (
            // <HtSiteTable sitesData={siteData} />
            <SiteListGroup sites={siteData} />
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
            <div className="text-muted text-center">
              <p>No sites to display</p>
              <p>
                Request access to sites within your organization from your{' '}
                <Link to="/profile">Profile</Link>
              </p>
            </div>
          )}
        </HtCard.Body>
      </HtCard>
    </Container>
  );
}
