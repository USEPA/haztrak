import { ManifestStatusSelect } from 'components/Manifest/GeneralInfo/ManifestStatusSelect';
import { ManifestTypeSelect } from 'components/Manifest/GeneralInfo/ManifestTypeSelect';
import { Manifest, SubmissionType } from 'components/Manifest/manifestSchema';
import { HtForm, InfoIconTooltip } from 'components/UI';
import { useReadOnly } from 'hooks/manifest';
import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

interface GeneralInfoFormProps {
  manifestData?: Partial<Manifest>;
  readOnly?: boolean;
  isDraft?: boolean;
}

const submissionTypeOptions: Array<{ value: SubmissionType; label: string }> = [
  { value: 'FullElectronic', label: 'Electronic' },
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'DataImage5Copy', label: 'Data + Image' },
  { value: 'Image', label: 'Image Only' },
];

export function GeneralInfoForm({ manifestData, isDraft }: GeneralInfoFormProps) {
  const [readOnly] = useReadOnly();
  const manifestForm = useFormContext<Manifest>();
  const { errors } = manifestForm.formState;
  return (
    <>
      <Row xs={1} sm={3}>
        <Col>
          <HtForm.Group>
            <HtForm.Label htmlFor="manifestTrackingNumber">MTN</HtForm.Label>
            <Form.Control
              id="manifestTrackingNumber"
              plaintext
              readOnly
              type="text"
              placeholder={
                !manifestData?.manifestTrackingNumber
                  ? 'Draft Manifest'
                  : manifestData?.manifestTrackingNumber
              }
              {...manifestForm.register('manifestTrackingNumber')}
              className={errors.manifestTrackingNumber && 'is-invalid'}
            />
            <div className="invalid-feedback">{errors.manifestTrackingNumber?.message}</div>
          </HtForm.Group>
        </Col>
        <Col>
          <ManifestStatusSelect readOnly={readOnly} isDraft={isDraft} />
        </Col>
        <Col>
          <ManifestTypeSelect readOnly={readOnly} isDraft={isDraft} />
        </Col>
      </Row>
      <Row xs={1} sm={3}>
        <Col>
          <HtForm.Group>
            <HtForm.Label htmlFor="createdDate" className="text-nowrap">
              {'Created Date '}
              <InfoIconTooltip message={'This field is managed by EPA'} />
            </HtForm.Label>
            <Form.Control
              id="createdDate"
              aria-label={'created date'}
              plaintext
              disabled
              type="date"
              value={manifestData?.createdDate?.slice(0, 10)}
              {...manifestForm.register('createdDate')}
              className={errors.createdDate && 'is-invalid'}
            />
            <div className="invalid-feedback">{errors.createdDate?.message}</div>
          </HtForm.Group>
        </Col>
        <Col>
          <HtForm.Group>
            <HtForm.Label htmlFor="updatedDate" className="text-nowrap">
              {'Last Update Date '}
              <InfoIconTooltip message={'This field is managed by EPA'} />
            </HtForm.Label>
            <Form.Control
              id="updatedDate"
              plaintext
              disabled
              type="date"
              value={manifestData?.updatedDate?.slice(0, 10)}
              {...manifestForm.register('updatedDate')}
              className={errors.updatedDate && 'is-invalid'}
            />
            <div className="invalid-feedback">{errors.updatedDate?.message}</div>
          </HtForm.Group>
        </Col>
        <Col>
          <HtForm.Group>
            <HtForm.Label htmlFor="shippedDate" className="text-nowrap">
              {'Shipped Date '}
              <InfoIconTooltip message={'This field is managed by EPA'} />
            </HtForm.Label>
            <Form.Control
              id="shippedDate"
              disabled
              plaintext
              type="date"
              value={manifestData?.shippedDate?.slice(0, 10)}
              {...manifestForm.register('shippedDate')}
              className={errors.shippedDate && 'is-invalid'}
            />
            <div className="invalid-feedback">{errors.shippedDate?.message?.toString()}</div>
          </HtForm.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <HtForm.Check
            type="checkbox"
            id="import"
            disabled={readOnly}
            label="Imported Waste"
            {...manifestForm.register('import')}
            className={errors.import && 'is-invalid'}
          />
          <div className="invalid-feedback">{errors.import?.message}</div>
          <HtForm.Check
            type="checkbox"
            id="rejection"
            disabled={readOnly}
            label="Rejected Waste"
            {...manifestForm.register('rejection')}
            className={errors.rejection && 'is-invalid'}
          />
          <div className="invalid-feedback">{errors.rejection?.message}</div>
        </Col>
        <Col>
          <HtForm.Group>
            <HtForm.Label htmlFor="potentialShipDate">Potential Ship Date</HtForm.Label>
            <Form.Control
              id="potentialShipDate"
              disabled={readOnly}
              type="date"
              {...manifestForm.register('potentialShipDate')}
              className={errors.potentialShipDate && 'is-invalid'}
            />
            <div className="invalid-feedback">{errors.potentialShipDate?.message}</div>
          </HtForm.Group>
        </Col>
      </Row>
    </>
  );
}
