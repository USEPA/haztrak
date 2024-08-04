import Select, { SingleValue } from 'react-select';
import React, { useState } from 'react';
import { useGetOrgsQuery } from '~/store';
import { useSearchParams } from 'react-router-dom';

export const OrgSelect = () => {
  const { isLoading, data: orgs } = useGetOrgsQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentOrg, setCurrentOrg] = useState<
    SingleValue<{
      label: string;
      value: string;
    }>
  >({
    value: searchParams.get('org') ?? '',
    label: orgs?.find((org) => org.slug === searchParams.get('org'))?.name ?? '',
  });

  const onChange = (option: SingleValue<{ label: string; value: string }>) => {
    if (!option) return;
    searchParams.set('org', option.value);
    setSearchParams(searchParams);
    setCurrentOrg(option);
  };

  return (
    <div data-testid="org-select">
      <Select
        value={currentOrg}
        isLoading={isLoading}
        options={orgs?.map((org) => ({ label: org.name, value: org.slug }))}
        onChange={onChange}
        classNames={{
          control: () => 'form-control p-0',
        }}
      />
    </div>
  );
};
