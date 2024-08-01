import { RcraSiteDetails } from '~/components/RcraSite';
import { HtCard, HtSpinner } from '~/components/UI';
import React, { ReactElement } from 'react';
import { Button, Container, Stack } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetUserHaztrakSiteQuery } from '~/store';

/**
 * GET and Display details of the Haztrak site including RCRA site details.
 *
 * This could be expanded to include other information about a haztrak site
 * if, for example, the site also had information relevant to the office of water (OW)
 * of data that's not directly related to any regulatory agency (the site's users).
 * @constructor
 */
export function SiteDetails(): ReactElement {
  const { siteId } = useParams();
  const { data, isLoading, error } = useGetUserHaztrakSiteQuery(siteId ? siteId : '');
  const navigate = useNavigate();

  if (error) throw error;
  if (isLoading) return <HtSpinner center />;
  if (data)
    return (
      <Container>
        <Stack className="my-3" gap={2}>
          <div className="pe-0 d-flex flex-row-reverse">
            <Button variant="primary" onClick={() => navigate(`/site/${siteId}/manifest`)}>
              View Manifest
            </Button>
          </div>
          <HtCard title={siteId}>
            <HtCard.Body>
              <RcraSiteDetails handler={data.handler} />
            </HtCard.Body>
          </HtCard>
        </Stack>
      </Container>
    );
  else return <div>Something went wrong</div>;
}
