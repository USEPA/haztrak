import { HtForm } from 'components/Ht';
import { RcraSite } from 'components/RcraSite';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import Select from 'react-select';
import { useAppSelector } from 'store';
import { userRcraSitesSelector } from 'store/rcraProfileSlice/rcraProfile.slice';

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
  const userRcraSites = useAppSelector(userRcraSitesSelector);
  const siteOptions = userRcraSites?.map((site) => site.site.handler);
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
