import { HtForm } from 'components/Ht';
import { RcraSite } from 'components/RcraSite';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import Select from 'react-select';
import { RootState, useAppSelector } from 'store';
import { selectUserSites, RcraProfileState } from 'store/rcraProfileSlice/rcraProfile.slice';

interface SiteSelectProps<T> {
  control: Control;
  selectedSite: T | undefined;
  setSelectedSite: (option: T | undefined) => void;
}

export function SiteSelect({
  control,
  selectedSite,
  setSelectedSite,
}: SiteSelectProps<RcraSite | undefined | null>) {
  const rcraSite = useAppSelector(selectUserSites);
  const siteOptions = rcraSite?.map((site) => site.site.handler);
  return (
    <>
      <HtForm.Label htmlFor="site">Site</HtForm.Label>
      <Controller
        control={control}
        name="site"
        data-testid="siteSelect"
        render={({ field }) => (
          <Select
            id="site"
            {...field} // object {name, onChange(), onBLur(), value, ref}
            openMenuOnFocus={false}
            onChange={setSelectedSite}
            components={{ IndicatorSeparator: () => null }}
            options={siteOptions}
            noOptionsMessage={() => 'No Sites found'}
            value={selectedSite}
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
