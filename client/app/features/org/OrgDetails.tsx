import React from 'react';
import { LoaderFunction } from 'react-router-dom';
import { CopyButton } from '~/components/CopyButton/CopyButton';
import { Card, CardContent, CardHeader, Spinner } from '~/components/ui';
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
          <CopyButton copyText={org.slug} className="tw-ml-0 tw-w-auto tw-self-start">
            <span>{org.slug}</span>
          </CopyButton>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
};
