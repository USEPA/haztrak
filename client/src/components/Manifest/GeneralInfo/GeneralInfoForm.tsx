import { ManifestStatusField } from 'components/Manifest/GeneralInfo/ManifestStatusField';
import { Manifest, SubmissionType } from 'components/Manifest/manifestSchema';
import { HtForm, InfoIconTooltip } from 'components/UI';
import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import Select from 'react-select';

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

export function GeneralInfoForm({ manifestData, readOnly, isDraft }: GeneralInfoFormProps) {
  const manifestForm = useFormContext<Manifest>();
  const { errors } = manifestForm.formState;
  return (
    <>
      <Row>
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
          <ManifestStatusField readOnly={readOnly} isDraft={isDraft} />
        </Col>
        <Col>
          <HtForm.Group>
            <HtForm.Label htmlFor="submissionType" className="mb-0">
              Type
            </HtForm.Label>
            <Select
              id="submissionType"
              isDisabled={readOnly || !isDraft}
              aria-label="submissionType"
              {...manifestForm.register('submissionType')}
              options={submissionTypeOptions}
              getOptionValue={(option) => option.value}
              defaultValue={submissionTypeOptions[0]}
              onChange={(option) => {
                if (option) manifestForm.setValue('submissionType', option.value);
              }}
              filterOption={(option) => {
                return (
                  option.label.toLowerCase().includes('electronic') ||
                  option.label.toLowerCase().includes('hybrid')
                );
              }}
            />
          </HtForm.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <HtForm.Group>
            <HtForm.Label htmlFor="createdDate">
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
            <HtForm.Label htmlFor="updatedDate">
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
            <HtForm.Label htmlFor="shippedDate">
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
