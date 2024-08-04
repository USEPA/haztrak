import React, { useEffect } from 'react';
import { LoaderFunction, Outlet, useSearchParams } from 'react-router-dom';
import { rootStore as store } from '~/store';
import { haztrakApi } from '~/store/htApi.slice';

export const orgLoader: LoaderFunction = async () => {
  const p = store.dispatch(haztrakApi.endpoints.getOrgs.initiate());

  try {
    const response = await p.unwrap();
    console.log('response', response);
    return response;
  } catch (e) {
    console.log(e);
  } finally {
    p.unsubscribe();
  }
};

export const Org = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (!searchParams.get('org')) {
      searchParams.set('org', 'foo');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  return <Outlet />;
};
