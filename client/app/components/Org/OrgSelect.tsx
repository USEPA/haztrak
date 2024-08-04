import Select, { SingleValue } from 'react-select';
import React, { useEffect, useState } from 'react';
import { useGetOrgsQuery } from '~/store';
import { useOrg } from '~/hooks/useOrg/useOrg';

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
