import Select from 'react-select';
import React from 'react';

export const OrgSelect = () => {
  return (
    <div data-testid="org-select">
      <Select
        options={[]}
        classNames={{
          control: () => `form-control p-0 rounded-2'} `,
        }}
      />
    </div>
  );
};
