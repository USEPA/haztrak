import React from 'react';
import { LoaderFunction, Outlet } from 'react-router-dom';
import { rootStore as store } from '~/store';
import { haztrakApi } from '~/store/htApi.slice';
import { useOrg } from '~/hooks/useOrg/useOrg';

export const orgsLoader: LoaderFunction = async () => {
  const p = store.dispatch(haztrakApi.endpoints.getOrgs.initiate());

  try {
    return await p.unwrap();
  } catch (_error) {
    console.error('Error fetching orgs');
    throw Error('Error fetching orgs');
  } finally {
    p.unsubscribe();
  }
};

export const Org = () => {
  useOrg();

  return <Outlet />;
};
