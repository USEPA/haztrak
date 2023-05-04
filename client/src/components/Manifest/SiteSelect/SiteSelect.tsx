import { HtForm } from 'components/Ht';
import { RcraSite } from 'components/RcraSite';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import Select, { GroupBase, OptionsOrGroups } from 'react-select';
import { RootState, useAppSelector } from 'store';
import { RcraProfileState, RcraSitePermissions } from 'store/rcraProfileSlice/rcraProfile.slice';

interface SiteSelectProps<T> {
  control: Control;
  selectedSite: T | null;
  setSelectedSite: (option: T | null) => void;
}

export function SiteSelect({
  control,
  selectedSite,
  setSelectedSite,
}: SiteSelectProps<RcraSite | null>) {
  const { rcraSites } = useAppSelector<RcraProfileState>((state: RootState) => state.rcraProfile);

  let siteOptions: Array<RcraSite> | undefined = undefined;
  if (rcraSites) {
    siteOptions = Object.values(rcraSites).map((obj) => obj.site.handler);
  }
  return (
    <>
      <HtForm.Label htmlFor="site">Site</HtForm.Label>
      <Controller
        control={control}
        name="site"
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
