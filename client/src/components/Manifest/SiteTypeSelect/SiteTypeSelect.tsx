import { HtCard } from 'components/Ht';
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
      <HtCard>
        <HtCard.Body>
          <p>{`Please select the role of ${siteId ? siteId : 'this handler'} on this manifest`}</p>
          <Form>
            <Controller
              control={control}
              render={() => {
                return (
                  <Form.Select
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
                );
              }}
              name={'test'}
            />
          </Form>
        </HtCard.Body>
      </HtCard>
    </>
  );
}
