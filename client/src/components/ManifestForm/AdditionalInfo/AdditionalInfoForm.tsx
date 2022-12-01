import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Row, Form, Button, Col } from 'react-bootstrap';
import { Manifest } from 'types';
import { WasteLine } from 'types/WasteLine';

// ToDo: this is POC source, should be cleaned up to be more stable.
//  see this example from react-hook-form
//  https://codesandbox.io/s/6j1760jkjk
function AdditionalInfoForm() {
  const { register, control } = useFormContext<Manifest | WasteLine>();
  const { fields, append, remove } = useFieldArray<
    Manifest | WasteLine,
    'additionalInfo.comments'
  >({
    control,
    name: 'additionalInfo.comments',
  });

  return (
    <>
      <Form.Group className="mb-2">
        <Form.Label className="mb-0">Special Handling Instructions</Form.Label>
        <Form.Control
          key={'handlingInstructions'}
          as="textarea"
          {...register(`additionalInfo.handlingInstructions`)}
        />
      </Form.Group>
      <p className="mb-0 fw-bold">Reference Information</p>
      {fields.length >= 1 ? (
        <Row>
          <Col xs={3}>
            <Form.Label>Label</Form.Label>
          </Col>
          <Col>
            <Form.Label>Description</Form.Label>
          </Col>
          <Col xs={1} />
        </Row>
      ) : (
        <></>
      )}
      <Row className="mb-3">
        {fields.map((field, index) => {
          const baseFieldName = `additionalInfo.comments`;
          const keyBase = `${field.id}-${index}`;
          return (
            <Row className="mb-3" key={`${keyBase}-row`}>
              <Col xs={3} key={`${keyBase}-col1`}>
                <Form.Group key={`${keyBase}-label-group`}>
                  <Form.Control
                    type="text"
                    key={`${keyBase}-label`}
                    // @ts-ignore
                    {...register(`${baseFieldName}[${index}].label`)}
                  />
                </Form.Group>
              </Col>
              <Col key={`${keyBase}-col2`}>
                <Form.Group key={`${keyBase}-group`}>
                  <Form.Control
                    type="text"
                    key={`${keyBase}-description-group`}
                    // @ts-ignore
                    {...register(`${baseFieldName}[${index}].description`)}
                  />
                </Form.Group>
              </Col>
              <Col xs={1} key={`${keyBase}-col3`}>
                <Button
                  key={`${keyBase}-remove`}
                  className="m-0 p-0 bg-transparent border-0"
                  onClick={() => {
                    remove(index);
                  }}
                >
                  <i
                    key={`${keyBase}-remove-btn`}
                    className="text-danger fas fa-times-circle fa-lg"
                  ></i>
                </Button>
              </Col>
            </Row>
          );
        })}
      </Row>
      <div>
        {/* ToDo: convert this to separate function*/}
        <Button onClick={() => append({ description: '', label: '' })}>
          Add Reference
        </Button>
      </div>
    </>
  );
}

export default AdditionalInfoForm;
