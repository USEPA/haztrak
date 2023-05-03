import React from 'react';
import { Control, Controller } from 'react-hook-form';
import Select, { GroupBase, OptionsOrGroups } from 'react-select';
import { RootState, useAppSelector } from 'store';
import { RcraProfileState, RcraSitePermissions } from 'store/rcraProfileSlice/rcraProfile.slice';

interface SiteSelectProps<T> {
  control: Control;
  selectedSite: T;
  setSelectedSite: (option: T) => void;
}

export function SiteSelect({ control, selectedSite, setSelectedSite }: SiteSelectProps<any>) {
  const { rcraSites } = useAppSelector<RcraProfileState>((state: RootState) => state.rcraProfile);
  let rcraSitesArray: OptionsOrGroups<any, GroupBase<any>> | undefined;
  if (rcraSites !== undefined) {
    rcraSitesArray = Object.keys(rcraSites).map(
      (rcraSiteNamedIndex) => rcraSites[rcraSiteNamedIndex]
    );
  }
  return (
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
          options={rcraSitesArray}
          noOptionsMessage={() => 'No Sites found'}
          value={selectedSite}
          getOptionLabel={(option) => option.epaId}
          getOptionValue={(option) => option.epaId}
          isSearchable
          isClearable
          classNames={{
            control: () => 'form-control p-0 rounded-2',
          }}
        />
      )}
    />
  );
}
