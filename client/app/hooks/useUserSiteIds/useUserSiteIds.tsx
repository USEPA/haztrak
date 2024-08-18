import { HaztrakSite } from '~/components/Site';
import { useGetUserHaztrakSitesQuery } from '~/store';

/**
 * Get select details for sites that the user has access to
 */
export function useUserSiteIds() {
  const { data, ...rest } = useGetUserHaztrakSitesQuery(undefined);

  const userSiteIds: string[] = data?.map((site: HaztrakSite) => site.handler.epaSiteId) || [];

  return { userSiteIds, data, ...rest };
}
