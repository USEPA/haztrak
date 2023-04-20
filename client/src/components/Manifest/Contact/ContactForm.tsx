import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Col, Form, Row } from 'react-bootstrap';
import { Manifest } from 'types/manifest';
import { HtForm } from 'components/Ht';

interface ContactFormProps {
  handlerFormType: 'generator' | 'designatedFacility';
  readOnly?: boolean;
}

export function ContactForm({ handlerFormType, readOnly }: ContactFormProps) {
  const namePrefix = `${handlerFormType}.contact`;
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
              {...register(`${handlerFormType}.contact.firstName`)}
            />
          </HtForm.Group>
        </Col>
        <Col>
          <HtForm.Group>
            <HtForm.Label htmlFor={`${namePrefix}MiddleInitial`}>Middle Initial</HtForm.Label>
            <Form.Control
              id={`${namePrefix}MiddleInitial`}
              type="text"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder="G"
              {...register(`${handlerFormType}.contact.middleInitial`)}
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
              {...register(`${handlerFormType}.contact.firstName`)}
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
              {...register(`${handlerFormType}.contact.email`)}
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
              {...register(`${handlerFormType}.contact.companyName`)}
            />
          </HtForm.Group>
        </Col>
      </Row>
    </>
  );
}
