import React from 'react';
import { LoaderFunction } from 'react-router-dom';
import { Spinner } from '~/components/ui';
import { useOrg } from '~/hooks/useOrg/useOrg';
import { rootStore as store } from '~/store';
import { haztrakApi } from '~/store/htApi.slice';

export const orgLoader: LoaderFunction = async ({ request }) => {
  const searchTerm = new URL(request.url).searchParams.get('org');
  if (!searchTerm) return null;
  const orgQuery = store.dispatch(haztrakApi.endpoints.getOrg.initiate(searchTerm));

  return orgQuery
    .unwrap()
    .catch((_err) => null)
    .finally(() => orgQuery.unsubscribe());
};

export const Org = () => {
  const {
    org: { data: org, isLoading },
  } = useOrg();

  if (isLoading) return <Spinner />;

  if (!org) return <div>Organization not found</div>;

  return (
    <div className="tw-flex-col ">
      <h1 className="tw-text-2xl tw-font-bold">Organization Details</h1>
    </div>
  );
};
