import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Row, Col, Form } from 'react-bootstrap';

function AdditionalInfoForm() {
  const { register } = useFormContext();

  return (
    <>
      <Row>
        <Form.Group className="mb-2">
          <Form.Label className="mb-0">
            Special Handling Instructions
          </Form.Label>
          <Form.Control
            as="textarea"
            {...register(`additionalInfo.comments`)}
          />
        </Form.Group>
      </Row>
      <Row>
        {/*<Form.Group className="mb-2">*/}
        {/*  <Form.Label className="mb-0">Units</Form.Label>*/}
        {/*</Form.Group>*/}
      </Row>
    </>
  );
}

export default AdditionalInfoForm;
