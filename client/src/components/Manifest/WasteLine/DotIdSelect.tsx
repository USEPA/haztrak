import { WasteLine } from 'components/Manifest/WasteLine/wasteLineSchema';
import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useLazyGetDotIdNumbersQuery } from 'store';
import Select from 'react-select';

interface DotIdOption {
  label: string;
  value: string;
}

export function DotIdSelect() {
  const {
    control,
    formState: { errors },
  } = useFormContext<WasteLine>();
  const [getDotIds, { data, isFetching, error: apiError }] = useLazyGetDotIdNumbersQuery();
  const [dotIdNumbers, setDotIdNumbers] = useState<DotIdOption[]>([]);

  const dataToOptions = (data: string[]) => {
    return data.map((dotIdNumber) => {
      return { label: dotIdNumber, value: dotIdNumber } as DotIdOption;
    }) as DotIdOption[];
  };

  useEffect(() => {
    // On mount, fetch and pre-populate DOT ID numbers with some initial options
    getDotIds('');
  }, []);

  useEffect(() => {
    if (data) {
      setDotIdNumbers(dataToOptions(data));
    }
  }, [data]);

  useEffect(() => {
    if (apiError) {
      console.error(apiError);
    }
  }, [apiError]);

  return (
    <>
      <Controller
        control={control}
        name={'dotInformation.idNumber.code'}
        render={({ field }) => {
          return (
            <Select
              id={'idNumber'}
              {...field}
              value={field.value ? { label: field.value, value: field.value } : null}
              options={dotIdNumbers}
              getOptionValue={(option: DotIdOption) => option.value}
              isLoading={isFetching}
              isClearable
              onInputChange={(inputValue) => {
                if (inputValue) {
                  getDotIds(inputValue);
                }
              }}
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
