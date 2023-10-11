import { WasteLine } from 'components/Manifest/WasteLine/wasteLineSchema';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import { htApi } from 'services';

interface DotIdOption {
  label: string;
  value: string;
}

export function DotIdSelect() {
  const {
    control,
    formState: { errors },
  } = useFormContext<WasteLine>();

  /**
   * retrieve a list of DOT ID numbers from the server
   * @param inputValue
   */
  const getDotIdNumbers = async (inputValue: string) => {
    const response = await htApi.get<Array<String>>('/rcra/waste/dot/id', {
      params: { q: inputValue },
    });
    const DotIDOptions: readonly DotIdOption[] = response.data.map((dotIdNumber) => {
      return { label: dotIdNumber, value: dotIdNumber } as DotIdOption;
    });
    return DotIDOptions;
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
              loadOptions={getDotIdNumbers}
              cacheOptions
              isClearable
              onChange={(option) => {
                field.onChange(option.value);
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
