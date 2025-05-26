import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { FaCircleXmark } from 'react-icons/fa6';
import { CopyButton } from '~/components/CopyButton/CopyButton';
import { Organization } from '~/store';

interface OrgDetailsProps {
  org: Organization;
}

export const OrgDetails = ({ org }: OrgDetailsProps) => {
  return (
    <div id="hero" className="tw:block tw:flex-initial">
      <h2 className="tw:text-lg tw:font-bold">{org.name}</h2>
      <div className="tw:mx-4">
        <CopyButton copyText={org.slug} className="tw:self-start tw:ps-0">
          <span>{org.slug}</span>
        </CopyButton>
        <p>
          <span>Is integrated with RCRAInfo: </span>
          {org.rcrainfoIntegrated ? (
            <FaCheckCircle className="text-success tw:inline" />
          ) : (
            <FaCircleXmark className="text-danger tw:inline" />
          )}
        </p>
      </div>
    </div>
  );
};
