import { HtCard, HtForm } from 'components/Ht';
import { HandlerTypeEnum } from 'components/Manifest/manifestSchema';
import React from 'react';
import { Form } from 'react-bootstrap';
import { Control, Controller } from 'react-hook-form';

interface SiteTypeSelectProps {
  siteType: HandlerTypeEnum | undefined;
  setSiteType: (siteType: HandlerTypeEnum) => void;
  control: Control;
  siteId?: string;
}

export function SiteTypeSelect({ siteType, setSiteType, control, siteId }: SiteTypeSelectProps) {
  return (
    <>
      <Form>
        <Controller
          control={control}
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
      </Form>
    </>
  );
}
