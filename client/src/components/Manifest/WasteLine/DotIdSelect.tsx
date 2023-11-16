import { WasteLine } from 'components/Manifest/WasteLine/wasteLineSchema';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import { haztrakApi, useAppDispatch } from 'store';

interface DotIdOption {
  label: string;
  value: string;
}

export function DotIdSelect() {
  const dispatch = useAppDispatch();
  const {
    control,
    formState: { errors },
  } = useFormContext<WasteLine>();

  /**
   * retrieve a list of DOT ID numbers from the server
   * @param inputValue
   */
  const getDotIdNumbers = async (inputValue: string) => {
    const response = await dispatch(haztrakApi.endpoints.getDotIdNumbers.initiate(inputValue));
    if (response.data) {
      return response.data.map((dotIdNumber) => {
        return { label: dotIdNumber, value: dotIdNumber } as DotIdOption;
      }) as readonly DotIdOption[];
    }
    return [];
  };

  return (
    <>
      <Controller
        control={control}
        name={'dotInformation.idNumber.code'}
        render={({ field }) => {
          return (
            <AsyncSelect
              id={'idNumber'}
              {...field}
              value={field.value ? { label: field.value, value: field.value } : null}
              loadOptions={getDotIdNumbers}
              getOptionValue={(option: DotIdOption) => option.value}
              cacheOptions
              isClearable
              onChange={(option) => {
                field.onChange(option?.value);
              }}
              classNames={{
                control: () =>
                  `form-control p-0 rounded-2 ${
                    errors.dotInformation?.idNumber?.code?.message && 'border-danger'
                  } `,
              }}
            />
          );
        }}
      />
    </>
  );
}
