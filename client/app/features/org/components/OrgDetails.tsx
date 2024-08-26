import React from 'react';
import { CopyButton } from '~/components/CopyButton/CopyButton';
import { Card, CardContent, CardHeader } from '~/components/ui';
import { Organization } from '~/store';

interface OrgDetailsProps {
  org: Organization;
}

export const OrgDetails = ({ org }: OrgDetailsProps) => {
  return (
    <div className="tw-flex-col ">
      <Card className="tw-max-w-screen-lg tw-grow">
        <CardHeader id="hero" className="tw-block tw-flex-initial">
          <h2 className="tw-text-lg tw-font-bold">{org.name}</h2>
          <CopyButton copyText={org.slug} className="tw-ml-0 tw-w-auto tw-self-start">
            <span>{org.slug}</span>
          </CopyButton>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
};
