import { HtForm } from 'components/Ht';
import { Controller, useFormContext } from 'react-hook-form';
import Select, { components } from 'react-select';
import React, { useContext } from 'react';
import { ManifestContext, ManifestContextProps } from 'components/Manifest/ManifestForm';
import { useGetStateWasteCodesQuery } from 'store/wasteCode.slice';

interface StateWasteCodeSelectProps {
  stateId?: string;
  fieldName: 'hazardousWaste.generatorStateWasteCodes' | ' hazardousWaste.tsdfStateWasteCodes';
}

export function StateWasteCodeSelect({ stateId, fieldName }: StateWasteCodeSelectProps) {
  const { control } = useFormContext();

  // If the generator has yet to be added to the manifest, we can't retrieve state waste codes
  if (!stateId)
    return (
      <Select
        id="hazardousWasteGeneratorStateCodes"
        isMulti
        isClearable
        hideSelectedOptions
        placeholder={
          <i className="text-muted">
            Generator must be provided before adding origin state waste codes
          </i>
        }
        isDisabled={true}
      />
    );

  const {
    data: stateWasteCodes,
    isLoading: stateLoading,
    error: stateError,
  } = useGetStateWasteCodesQuery(stateId);

  /**
   * This is a custom component we use to display waste codes so that the full
   * description of the waste code is present when selecting from the dropdown
   * but only contains the ~4-digit code once selected.
   * see SO question here
   * https://stackoverflow.com/questions/52482985/react-select-show-different-text-label-for-drop-down-and-control
   */
  const MultiValue = (props: any) => (
    <components.MultiValue {...props}>{props.data.code}</components.MultiValue>
  );

  console.log('waste codes', stateWasteCodes);
  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field }) => {
        return (
          <Select
            id={fieldName}
            {...field}
            options={stateWasteCodes}
            isLoading={stateLoading}
            getOptionLabel={(option) => `${option.code}: ${option.description.toLowerCase()}`}
            getOptionValue={(option) => option.code}
            openMenuOnFocus={false}
            components={{ MultiValue }}
            isMulti
            isClearable
            hideSelectedOptions
          />
        );
      }}
    ></Controller>
  );
}
