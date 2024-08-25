import React from 'react';
import { LuCopy } from 'react-icons/lu';
import { LoaderFunction } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader, Spinner } from '~/components/ui';
import { useOrg } from '~/hooks/useOrg/useOrg';
import { rootStore as store } from '~/store';
import { haztrakApi } from '~/store/htApi.slice';

export const orgDetailsLoader: LoaderFunction = async ({ request }) => {
  const searchTerm = new URL(request.url).searchParams.get('org');
  if (!searchTerm) return null;
  const orgQuery = store.dispatch(haztrakApi.endpoints.getOrg.initiate(searchTerm));

  return orgQuery
    .unwrap()
    .catch((_err) => null)
    .finally(() => orgQuery.unsubscribe());
};

export const OrgDetails = () => {
  const {
    org: { data: org, isLoading },
  } = useOrg();

  if (isLoading) return <Spinner />;

  if (!org) return <div>Organization not found</div>;

  return (
    <div className="tw-flex-col ">
      <h1 className="tw-text-2xl tw-font-bold">Organization Details</h1>
      <Card className="tw-max-w-screen-lg tw-grow">
        <CardHeader id="hero" className="tw-block tw-flex-initial">
          <h2 className="tw-text-lg tw-font-bold">{org.name}</h2>
          <Button
            variant="link"
            className="tw-ml-0 tw-w-auto tw-self-start"
            onClick={() => {
              navigator.clipboard.writeText(org.slug);
            }}
          >
            <p className="tw-mt-0 tw-font-mono tw-text-xs">{org.slug}</p>
            <LuCopy className="tw-ml-2 tw-h-4 tw-w-4" />
          </Button>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
};
