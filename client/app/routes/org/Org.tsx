import React, { useEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';

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
