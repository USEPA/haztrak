import React, { useEffect } from 'react';
import { LoaderFunction, Outlet, useSearchParams } from 'react-router-dom';
import { rootStore as store, useGetOrgsQuery } from '~/store';
import { haztrakApi } from '~/store/htApi.slice';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: orgs } = useGetOrgsQuery();
  useEffect(() => {
    const orgSearchParam = searchParams.get('org');

    if (orgSearchParam && orgs) {
      if (!orgs.find((org) => org.slug === orgSearchParam)) {
        searchParams.delete('org');
        setSearchParams(searchParams);
      }
    }

    if (!orgSearchParam && orgs) {
      searchParams.set('org', orgs[0].slug);
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, orgs]);

  return <Outlet />;
};
