import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select, { components } from 'react-select';
import { useGetStateWasteCodesQuery } from '~/store';

interface StateWasteCodeSelectProps {
  stateId?: string;
  fieldName: 'hazardousWaste.generatorStateWasteCodes' | 'hazardousWaste.tsdfStateWasteCodes';
}

export function StateWasteCodeSelect({ stateId, fieldName }: StateWasteCodeSelectProps) {
  const { control } = useFormContext();

  // If the generator/tsdf has yet to be added to the manifest, we can't retrieve state waste codes
  if (!stateId)
    return (
      <Select
        id="hazardousWasteGeneratorStateCodes"
        isMulti
        isClearable
        hideSelectedOptions
        placeholder={
          <i className="text-muted">
            {fieldName === 'hazardousWaste.generatorStateWasteCodes'
              ? 'Generator must be provided before adding generator state waste codes'
              : 'TSDF must be provided before adding destination state waste codes'}
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
   * but only contains the 3 to 6-digit code once selected.
   * see SO question here
   * https://stackoverflow.com/questions/52482985/react-select-show-different-text-label-for-drop-down-and-control
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MultiValue = (props: any) => (
    <components.MultiValue {...props}>{props.data.code}</components.MultiValue>
  );

  return (
    <>
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
      />
      {stateError ? (
        <i className="text-danger">We experienced an error retrieving the state waste codes</i>
      ) : (
        <></>
      )}
    </>
  );
}
