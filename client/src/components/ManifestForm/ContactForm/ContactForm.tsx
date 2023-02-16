import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Col, Form, Row } from 'react-bootstrap';
import { Manifest } from 'types';

interface ContactFormProps {
  handlerFormType: 'generator' | 'designatedFacility';
  readOnly?: boolean;
}

export default function ContactForm({ handlerFormType, readOnly }: ContactFormProps) {
  const namePrefix = `${handlerFormType}.contact`;
  const { register } = useFormContext<Manifest>();

  return (
    <>
      <Row className="mb-2">
        <Col>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0" htmlFor={`${namePrefix}FirstName`}>
              First name
            </Form.Label>
            <Form.Control
              id={`${namePrefix}FirstName`}
              type="text"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder="John"
              {...register(`${handlerFormType}.contact.firstName`)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0" htmlFor={`${namePrefix}MiddleInitial`}>
              Middle Initial
            </Form.Label>
            <Form.Control
              id={`${namePrefix}MiddleInitial`}
              type="text"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder="G"
              {...register(`${handlerFormType}.contact.middleInitial`)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0" htmlFor={`${namePrefix}LastName`}>
              Last Name
            </Form.Label>
            <Form.Control
              id={`${namePrefix}LastName`}
              type="text"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder="Doe"
              {...register(`${handlerFormType}.contact.firstName`)}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0" htmlFor={`${namePrefix}Email`}>
              e-mail
            </Form.Label>
            <Form.Control
              id={`${namePrefix}Email`}
              type="email"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder="john.doe@haztrak.net"
              {...register(`${handlerFormType}.contact.email`)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0" htmlFor={`${namePrefix}CompanyName`}>
              Company
            </Form.Label>
            <Form.Control
              id={`${namePrefix}CompanyName`}
              type="text"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder="HazTek LLC."
              {...register(`${handlerFormType}.contact.companyName`)}
            />
          </Form.Group>
        </Col>
      </Row>
    </>
  );
}
