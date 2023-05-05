import { HtForm } from 'components/Ht';
import { RcraSiteType } from 'components/Manifest/manifestSchema';
import React from 'react';
import { Form } from 'react-bootstrap';
import { Control, Controller } from 'react-hook-form';

interface SiteTypeSelectProps {
  siteType: RcraSiteType | undefined;
  setSiteType: (siteType: RcraSiteType) => void;
  control: Control;
  siteId?: string;
}

export function SiteTypeSelect({ siteType, setSiteType, control, siteId }: SiteTypeSelectProps) {
  return (
    <>
      <Controller
        control={control}
        data-testid="siteTypeSelect"
        render={() => (
          <div className="mt-2">
            <HtForm.Label htmlFor="siteType">Site Role</HtForm.Label>
            <Form.Select
              id="siteType"
              value={siteType}
              // @ts-ignore
              onChange={(event) => setSiteType(event.target.value)}
              defaultValue={''}
            >
              <option value={''} disabled>
                - -
              </option>
              <option value={'generator'}>Generator</option>
              <option value={'transporter'}>Transporter</option>
              <option value={'designatedFacility'}>TSDF</option>
            </Form.Select>
          </div>
        )}
        name={'test'}
      />
    </>
  );
}
