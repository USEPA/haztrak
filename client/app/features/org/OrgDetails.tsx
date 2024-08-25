import React from 'react';
import { LoaderFunction } from 'react-router-dom';
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
  return (
    <div>
      <h1>Organization Details</h1>
    </div>
  );
};
