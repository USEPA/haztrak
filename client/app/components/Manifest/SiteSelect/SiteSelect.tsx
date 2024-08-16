import { createSelector } from '@reduxjs/toolkit';
import { HtForm } from 'app/components/legacyUi';
import React, { useMemo } from 'react';
import { Control, Controller } from 'react-hook-form';
import Select from 'react-select';
import { HaztrakSite } from 'app/components/Site';
import { RcraSite } from '~/components/RcraSite';
import { useGetUserHaztrakSitesQuery } from '~/store';

interface SiteSelectProps<T> {
  control: Control;
  value: T | undefined;
  handleChange: (option: T | undefined) => void;
}

export function SiteSelect({
  control,
  value,
  handleChange,
}: SiteSelectProps<RcraSite | undefined | null>) {
  const selectUserSites = useMemo(() => {
    return createSelector(
      (res) => res?.data,
      (data: HaztrakSite[]) => (!data ? [] : Object.values(data).map((site) => site.handler))
    );
  }, []);

  const { siteOptions } = useGetUserHaztrakSitesQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      siteOptions: selectUserSites(result),
    }),
  });

  return (
    <>
      <HtForm.Label htmlFor="site">Site</HtForm.Label>
      <Controller
        control={control}
        name="site"
        data-testid="siteSelect"
        render={({ field }) => (
          <Select
            aria-label="Site Select"
            id="site"
            {...field} // object {name, onChange(), onBLur(), value, ref}
            openMenuOnFocus={false}
            onChange={handleChange}
            components={{ IndicatorSeparator: () => null }}
            options={siteOptions}
            noOptionsMessage={() => 'No Sites found'}
            value={value}
            getOptionLabel={(option) => `${option.epaSiteId} -- ${option.name}`}
            getOptionValue={(option) => option.epaSiteId}
            isSearchable
            isClearable
            classNames={{
              control: () => 'form-control p-0 rounded-2',
            }}
          />
        )}
      />
    </>
  );
}
