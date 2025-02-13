import React, { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { Manifest } from '~/components/Manifest';
import { HtForm } from '~/components/legacyUi';

interface ContactFormProps {
  handlerType: 'generator' | 'designatedFacility';
  readOnly?: boolean;
}

export function PhoneForm({ handlerType, readOnly }: ContactFormProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<Manifest>();
  const [number, setNumber] = useState<string | undefined>('');
  const handlerNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // The input value stripped of non-numeric character
    const rawNumber = value.trim().replace(/[^0-9]/g, '');
    let formattedNumber;

    if (rawNumber.length <= 3) {
      formattedNumber = rawNumber;
    } else if (rawNumber.length > 3 && rawNumber.length <= 6) {
      formattedNumber = rawNumber.replace(/(\d{3})(\d)/, '$1-$2');
    } else {
      formattedNumber = rawNumber.replace(/(\d{3})(\d{3})(\d)/, '$1-$2-$3');
    }

    setNumber(formattedNumber);
  };

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
              value={number}
              maxLength={12}
              type="text"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder="202-505-5505"
              {...register(`${handlerType}.emergencyPhone.number`, {
                onChange: handlerNumberChange,
              })}
              className={handlerErrors?.emergencyPhone?.number && 'is-invalid'}
            />
            <div className="invalid-feedback">{handlerErrors?.emergencyPhone?.number?.message}</div>
          </HtForm.Group>
        </Col>
        <Col xs={3}>
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
          </HtForm.Group>
        </Col>
      </Row>
    </>
  );
}
