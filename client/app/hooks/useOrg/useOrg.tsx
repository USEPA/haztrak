import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetOrgsQuery } from '~/store';

export const useOrg = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: orgs } = useGetOrgsQuery();
  const [orgSlug, setOrgSlug] = useState<string | null>(searchParams.get('org'));

  const setOrgSlugState = useCallback(
    (slug: string | null) => {
      setOrgSlug(slug);
      if (slug) {
        searchParams.set('org', slug);
      } else {
        searchParams.delete('org');
      }
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    const orgIdSearchParam = searchParams.get('org');

    // If an orgId is set, and we have the users orgs, check if the orgId is valid, remove otherwise
    if (orgIdSearchParam && orgs) {
      if (!orgs.find((org) => org.slug === orgSlug)) {
        searchParams.delete('org');
        setSearchParams(searchParams);
      }
    }

    // if no org is set in the URL, and we have orgs, set the first org as the default
    if (!orgIdSearchParam && orgs) {
      searchParams.set('org', orgs[0].slug);
      setSearchParams(searchParams);
    }

    // if URL is populated but not our state, set the state
    if (orgIdSearchParam && !orgSlug) {
      setOrgSlug(orgIdSearchParam);
    }
  }, [searchParams, setSearchParams, orgs, orgSlug]);

  return { orgId: orgSlug, setOrgId: setOrgSlugState };
};
