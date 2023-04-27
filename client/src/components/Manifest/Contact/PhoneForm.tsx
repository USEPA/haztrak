import { ErrorMessage } from '@hookform/error-message';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Col, Form, Row } from 'react-bootstrap';
import { Manifest } from 'types/manifest';
import { HtForm } from 'components/Ht';

interface ContactFormProps {
  handlerType: 'generator' | 'designatedFacility';
  readOnly?: boolean;
}

export function PhoneForm({ handlerType, readOnly }: ContactFormProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<Manifest>();

  // Destructure the handler errors depending on whether this is form for
  // manifest generator of designated facility for use in the form.
  let handlerErrors = errors.generator;
  if (handlerType === 'designatedFacility') {
    handlerErrors = errors.designatedFacility;
  }

  return (
    <>
      <Row className="mb-2">
        <Col>
          <HtForm.Group>
            <HtForm.Label htmlFor={`${handlerType}Number`}>Phone Number</HtForm.Label>
            <Form.Control
              id={`${handlerType}Number`}
              type="text"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder="202-505-5505"
              {...register(`${handlerType}.emergencyPhone.number`)}
              className={handlerErrors?.emergencyPhone?.number && 'is-invalid'}
            />
            <div className="invalid-feedback">{handlerErrors?.emergencyPhone?.number?.message}</div>
          </HtForm.Group>
        </Col>
        <Col>
          <HtForm.Group>
            <HtForm.Label htmlFor={`${handlerType}Extension`}>Extension</HtForm.Label>
            <Form.Control
              id={`${handlerType}Extension`}
              type="text"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder="345"
              {...register(`${handlerType}.emergencyPhone.extension`)}
              className={handlerErrors?.emergencyPhone?.extension && 'is-invalid'}
            />
            <div className="invalid-feedback">
              {handlerErrors?.emergencyPhone?.extension?.message}
            </div>
            <ErrorMessage
              errors={errors}
              name={`${handlerType}.emergencyPhone.extension`}
              render={({ message }) => <span className="text-danger">{message}</span>}
            />
          </HtForm.Group>
        </Col>
      </Row>
    </>
  );
}
