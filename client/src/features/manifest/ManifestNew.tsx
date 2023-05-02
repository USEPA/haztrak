import { HtCard, HtForm } from 'components/Ht';
import { ManifestForm } from 'components/Manifest';
import { useTitle } from 'hooks';
import React, { useState } from 'react';
import { Fade, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

export function ManifestNew() {
  useTitle('New Manifest');
  const { siteId: manifestingSiteId } = useParams();
  const [manifestingSiteType, setManifestingSiteType] = useState<
    'generator' | 'designatedFacility' | 'transporter' | undefined
  >(undefined);
  const [open, setOpen] = useState<boolean>(true);
  const { control } = useForm();
  console.log(manifestingSiteType);
  if (manifestingSiteType === undefined) {
    return (
      <>
        <HtCard>
          <HtCard.Body>
            <p>{`Please select the role of ${manifestingSiteId} on this manifest`}</p>
            <Form>
              <Controller
                control={control}
                render={() => {
                  return (
                    <Form.Select
                      value={manifestingSiteType}
                      // @ts-ignore
                      onChange={(event) => setManifestingSiteType(event.target.value)}
                    >
                      <option value={''} disabled selected>
                        Please select
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
  if (manifestingSiteId) {
    return <ManifestForm />;
  }

  return <p>hello</p>;
}
