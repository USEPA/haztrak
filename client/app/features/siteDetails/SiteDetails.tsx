import { HtCard, HtSpinner } from '~/components/legacyUi';
import React, { ReactElement } from 'react';
import { Button, Container, Stack } from 'react-bootstrap';
import { LoaderFunction, redirect, useNavigate, useParams } from 'react-router-dom';
import { RcraSiteDetails } from '~/components/RcraSite/RcraSiteDetails';
import { rootStore as store, useGetUserHaztrakSiteQuery } from '~/store';
import { haztrakApi } from '~/store/htApi.slice';

export const siteDetailsLoader: LoaderFunction = async ({ params }) => {
  const { siteId } = params;
  if (!siteId) return null;
  const p = store.dispatch(haztrakApi.endpoints.getUserHaztrakSite.initiate(siteId));

  try {
    return await p.unwrap();
  } catch (_error) {
    console.error('Error fetching orgs');
    return redirect('/login');
  } finally {
    p.unsubscribe();
  }
};

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

  if (isLoading) return <HtSpinner center />;
  if (error) throw new Error(error.message);
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
