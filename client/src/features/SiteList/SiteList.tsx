import { SiteListGroup } from 'components/HaztrakSite';
import { HtCard } from 'components/UI';
import { useTitle } from 'hooks';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGetUserHaztrakSitesQuery } from 'store';

/** Returns a table displaying the Haztrak sites a user has access to.*/
export function SiteList() {
  useTitle('Sites');
  const { data, isLoading, error } = useGetUserHaztrakSitesQuery();
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
          {isLoading && !error ? (
            <HtCard.Spinner />
          ) : data ? (
            <SiteListGroup sites={data} />
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
