import { HtForm } from 'components/Ht';
import { Controller, useFormContext } from 'react-hook-form';
import Select, { components } from 'react-select';
import React, { useContext } from 'react';
import { ManifestContext, ManifestContextProps } from 'components/Manifest/ManifestForm';
import { useGetStateWasteCodesQuery } from 'store/wasteCode.slice';

export function StateWasteCodeSelect() {
  const { generatorState } = useContext<ManifestContextProps>(ManifestContext);
  const { control } = useFormContext();

  if (!generatorState) return null;

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
    <HtForm.Group className="mb-3">
      <HtForm.Label className="mb-0" htmlFor="hazardousWasteGeneratorStateCodes">
        Generator State Waste Codes
      </HtForm.Label>
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
    </HtForm.Group>
  );
}
