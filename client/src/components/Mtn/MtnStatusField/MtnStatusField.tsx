import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';

export interface StatusOption {
  value: string;
  label: string;
}

const statusOptions: readonly StatusOption[] = [
  { value: 'Scheduled', label: 'Scheduled' },
  { value: 'InTransit', label: 'In Transit' },
  { value: 'ReadyForSignature', label: 'Ready to Sign' },
  { value: 'Corrected', label: 'Corrected' },
  { value: 'Signed', label: 'Signed' },
  { value: 'NotAssigned', label: 'Draft' },
  { value: 'UnderCorrection', label: 'Under Correction' },
];

interface MtnStatusFieldProps {
  onChange: (newValue: StatusOption | null) => void;
}

const parseSearchParam = (searchParam: string | null): StatusOption | null => {
  if (!searchParam) return null;
  const option = statusOptions.find(
    (option) => option.value.toLowerCase() === searchParam.toLowerCase()
  );
  return option || null;
};

export function MtnStatusField({ onChange }: MtnStatusFieldProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get('status');
  const [searchValue, setSearchValue] = useState<StatusOption | null>(
    parseSearchParam(statusParam)
  );

  const onSelection = (newValue: StatusOption | null) => {
    setSearchValue(newValue);
  };

  useEffect(() => {
    onChange(searchValue);
    if (searchValue) {
      searchParams.set('status', searchValue?.value.toLowerCase());
    } else {
      searchParams.delete('status');
    }
    setSearchParams(searchParams);
  }, [searchValue]);

  return (
    <div>
      <Select
        name="statusFilter"
        aria-label="status filter"
        value={searchValue}
        onChange={onSelection}
        options={statusOptions}
        isClearable={true}
        classNames={{
          control: () => 'form-select py-0 ms-2 rounded-3',
          placeholder: () => 'p-0 m-0 ps-1',
        }}
        components={{ IndicatorSeparator: () => null, DropdownIndicator: () => null }}
      />
    </div>
  );
}
