import { ReactElement } from 'react';
import { LoaderFunction, useNavigate, useParams } from 'react-router';
import { RcraSiteDetails } from '~/components/RcraSite/RcraSiteDetails';
import { Button, Card, CardContent, CardHeader, Spinner } from '~/components/ui';
import { rootStore as store, useGetUserHaztrakSiteQuery } from '~/store';
import { haztrakApi } from '~/store/htApi.slice';

export const siteDetailsLoader: LoaderFunction = async ({ params }) => {
  const { siteId } = params;
  if (!siteId) return null;
  const p = store.dispatch(haztrakApi.endpoints.getUserHaztrakSite.initiate(siteId));

  try {
    return await p.unwrap();
  } catch (_error) {
    return null;
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

  if (isLoading) return <Spinner />;
  if (error) throw new Error(error.message);
  if (data)
    return (
      <div className="tw-container">
        <div className="my-3 tw-flex tw-flex-col tw-space-y-2">
          <h2 className="tw-text-start tw-text-2xl tw-font-bold">Site Details</h2>
          <div className="tw-flex tw-flex-row-reverse tw-pe-0">
            <Button variant="secondary" onClick={() => navigate(`/site/${siteId}/manifest`)}>
              View Manifest
            </Button>
          </div>
          <Card className="tw-drop-shadow-2xl">
            <CardHeader>
              <h2 className="tw-text-xl tw-font-bold">{data.name}</h2>
            </CardHeader>
            <CardContent className="tw-p-5">
              <RcraSiteDetails handler={data.handler} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  else return <div>Something went wrong</div>;
}
