import { createSelector } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { ProfileSlice, useGetProfileQuery } from 'store';

/**
 * Get select details for sites that the user has access to
 */
export function useUserSiteIds() {
  const selectUserSiteIds = useMemo(
    () =>
      createSelector(
        (res) => res.data,
        (data: ProfileSlice) =>
          !data || !data.sites
            ? []
            : Object.values(data.sites).map((site) => ({
                epaSiteId: site.handler.epaSiteId,
                permissions: site.permissions,
              }))
      ),
    []
  );

  const { userSiteIds, ...rest } = useGetProfileQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      userSiteIds: selectUserSiteIds(result),
    }),
  });

  return { userSiteIds, ...rest };
}
