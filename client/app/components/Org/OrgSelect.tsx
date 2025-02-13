import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { useOrg } from '~/hooks/useOrg/useOrg';
import { useGetOrgsQuery } from '~/store';

export const OrgSelect = () => {
  const { isLoading, data: orgs } = useGetOrgsQuery();
  const { orgId, setOrgId } = useOrg();
  const [currentOrg, setCurrentOrg] = useState<
    SingleValue<{
      label: string;
      value: string;
    }>
  >({
    value: orgId ?? '',
    label: orgs?.find((org) => org.slug === orgId)?.name ?? '',
  });

  useEffect(() => {
    if (orgId && orgs) {
      setCurrentOrg({
        value: orgId,
        label: orgs.find((org) => org.slug === orgId)?.name ?? '',
      });
    }
  }, [orgId, orgs, setCurrentOrg]);

  const onChange = (option: SingleValue<{ label: string; value: string }>) => {
    if (!option) return;
    setOrgId(option.value);
    setCurrentOrg(option);
  };

  return (
    <div data-testid="org-select" className="tw-min-w-full">
      <Select
        value={currentOrg}
        isLoading={isLoading}
        options={orgs?.map((org) => ({ label: org.name, value: org.slug }))}
        onChange={onChange}
        classNames={{
          control: () => 'border border-gray-300 rounded-md',
          container: () => 'tw-min-w-full',
        }}
      />
    </div>
  );
};
