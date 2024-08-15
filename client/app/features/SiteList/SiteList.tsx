import { HtCard, HtSpinner } from 'app/components/legacyUi';
import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { SiteListGroup } from 'app/components/Site';
import { useTitle } from '~/hooks';
import { useGetUserHaztrakSitesQuery } from '~/store';

/** Returns a table displaying the Haztrak sites a user has access to.*/
export function SiteList() {
  useTitle('Sites');
  const { data, isLoading } = useGetUserHaztrakSitesQuery(); // ToDO global error handling

  if (isLoading) return <HtSpinner center size="6x" />;

  return (
    <Container className="my-3">
      <HtCard title="My Sites">
        <HtCard.Body>
          {data ? (
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
