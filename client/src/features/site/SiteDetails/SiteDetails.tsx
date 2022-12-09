import HandlerDetails from 'components/HandlerDetails';
import HtCard from 'components/HtCard';
import HtDropdown from 'components/HtDropdown';
import useHtAPI from 'hooks/useHtAPI';
import React, { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { Site } from 'types/Handler';

/**
 * GET and Display details of the hazardous waste site specified in the URL
 * @constructor
 */
function SiteDetails(): ReactElement {
  let { siteId } = useParams();
  const [siteData, loading, error] = useHtAPI<Site>(`trak/site/${siteId}`);

  console.log(siteData);

  return (
    <>
      <HtCard>
        <HtCard.Header title={siteId}>
          <HtDropdown links={[{ name: 'hello', path: '#/blah/' }]} />
        </HtCard.Header>
        <HtCard.Body>
          {loading ? (
            <HtCard.Spinner message="Loading site details..." />
          ) : siteData ? (
            <HandlerDetails handler={siteData.handler} />
          ) : (
            <p>{error?.message}</p>
          )}
        </HtCard.Body>
      </HtCard>
    </>
  );
}

export default SiteDetails;
