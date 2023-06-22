import { HtForm } from 'components/Ht';
import { Controller, useFormContext } from 'react-hook-form';
import Select, { components } from 'react-select';
import React, { useContext } from 'react';
import { ManifestContext, ManifestContextProps } from 'components/Manifest/ManifestForm';
import { useGetStateWasteCodesQuery } from 'store/wasteCode.slice';

export function StateWasteCodeSelect() {
  const { generatorState } = useContext<ManifestContextProps>(ManifestContext);
  const { control } = useFormContext();

  // If the generator has yet to be added to the manifest, we can't retrieve state waste codes
  if (!generatorState)
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
    data: generatorStateWasteCodes,
    isLoading: generatorStateLoading,
    error: generatorStateError,
  } = useGetStateWasteCodesQuery(generatorState);

  const MultiValue = (props: any) => (
    <components.MultiValue {...props}>{props.data.code}</components.MultiValue>
  );

  console.log('gen waste codes', generatorStateWasteCodes);
  return (
    <Controller
      control={control}
      name="hazardousWaste.generatorStateWasteCodes"
      render={({ field }) => {
        return (
          <Select
            id="hazardousWasteGeneratorStateCodes"
            {...field}
            options={generatorStateWasteCodes}
            isLoading={generatorStateLoading}
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
