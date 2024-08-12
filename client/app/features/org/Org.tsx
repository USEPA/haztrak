import React from 'react';
import { LoaderFunction, Outlet, redirect } from 'react-router-dom';
import { useOrg } from '~/hooks/useOrg/useOrg';
import { rootStore as store } from '~/store';
import { haztrakApi } from '~/store/htApi.slice';

export const orgsLoader: LoaderFunction = async () => {
  const p = store.dispatch(haztrakApi.endpoints.getOrgs.initiate());

  try {
    return await p.unwrap();
  } catch (_error) {
    console.error('Error fetching orgs');
    return redirect('/login');
    // throw Error('Error fetching orgs');
  } finally {
    p.unsubscribe();
  }
};

export const Org = () => {
  useOrg();

  return <Outlet />;
};
