import { PhoneForm } from 'components/Manifest/Contact/PhoneForm';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Col, Form, Row } from 'react-bootstrap';
import { Manifest } from 'types/manifest';
import { HtForm } from 'components/Ht';

interface ContactFormProps {
  handlerType: 'generator' | 'designatedFacility';
  readOnly?: boolean;
}

export function ContactForm({ handlerType, readOnly }: ContactFormProps) {
  const namePrefix = `${handlerType}.contact`;
  const { register } = useFormContext<Manifest>();

  return (
    <>
      <Row className="mb-2">
        <Col>
          <HtForm.Group>
            <HtForm.Label htmlFor={`${namePrefix}FirstName`}>First name</HtForm.Label>
            <Form.Control
              id={`${namePrefix}FirstName`}
              type="text"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder="John"
              {...register(`${handlerType}.contact.firstName`)}
            />
          </HtForm.Group>
        </Col>
        <Col xs={3}>
          <HtForm.Group>
            <HtForm.Label htmlFor={`${namePrefix}MiddleInitial`}>Middle Initial</HtForm.Label>
            <Form.Control
              id={`${namePrefix}MiddleInitial`}
              type="text"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder="G"
              {...register(`${handlerType}.contact.middleInitial`)}
            />
          </HtForm.Group>
        </Col>
        <Col>
          <HtForm.Group>
            <HtForm.Label htmlFor={`${namePrefix}LastName`}>Last Name</HtForm.Label>
            <Form.Control
              id={`${namePrefix}LastName`}
              type="text"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder="Doe"
              {...register(`${handlerType}.contact.firstName`)}
            />
          </HtForm.Group>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col>
          <HtForm.Group>
            <HtForm.Label htmlFor={`${namePrefix}Email`}>e-mail</HtForm.Label>
            <Form.Control
              id={`${namePrefix}Email`}
              type="email"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder="john.doe@haztrak.net"
              {...register(`${handlerType}.contact.email`)}
            />
          </HtForm.Group>
        </Col>
        <Col>
          <HtForm.Group>
            <HtForm.Label htmlFor={`${namePrefix}CompanyName`}>Company</HtForm.Label>
            <Form.Control
              id={`${namePrefix}CompanyName`}
              type="text"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder="HazTek LLC."
              {...register(`${handlerType}.contact.companyName`)}
            />
          </HtForm.Group>
        </Col>
      </Row>
      <PhoneForm handlerType={handlerType} readOnly={readOnly} />
    </>
  );
}
