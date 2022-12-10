import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Manifest } from 'types';
import { WasteLine } from 'types/WasteLine';

// ToDo: this is POC source, clean up work appreciated
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
      <p className="mb-0 ">Reference Information</p>
      <Col>
        <Row className="mb-3">
          {fields.map((field, index) => {
            const baseFieldName = `additionalInfo.comments`;
            const keyBase = `${field.id}-${index}`;
            return (
              <Row className="mb-3" key={`${keyBase}-row`}>
                <Col xs={3} key={`${keyBase}-col1`}>
                  {/* column for the Label field */}
                  <Form.Group key={`${keyBase}-label-group`}>
                    {/* Only add a label if it's the first row*/}
                    {index === 0 ? (
                      <Form.Label htmlFor={`additionalInfoLabel${index}`}>
                        Label
                      </Form.Label>
                    ) : (
                      <></>
                    )}
                    <Form.Control
                      type="text"
                      id={`additionalInfoLabel${index}`}
                      key={`${keyBase}-label`}
                      // @ts-ignore
                      {...register(`${baseFieldName}[${index}].label`)}
                    />
                  </Form.Group>
                </Col>
                <Col key={`${keyBase}-col2`}>
                  <Form.Group key={`${keyBase}-group`}>
                    {index === 0 ? (
                      <Form.Label htmlFor={`additionalInfoDescription${index}`}>
                        Description
                      </Form.Label>
                    ) : (
                      <></>
                    )}
                    {/* column for the Description field */}
                    <Form.Control
                      id={`additionalInfoDescription${index}`}
                      type="text"
                      key={`${keyBase}-description-group`}
                      // @ts-ignore
                      {...register(`${baseFieldName}[${index}].description`)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={1} key={`${keyBase}-col3`}>
                  {index === 0 ? (
                    <Form.Label htmlFor={`additionalInfoRemoveButton${index}`}>
                      Remove
                    </Form.Label>
                  ) : (
                    <></>
                  )}
                  {/* Users can remove a Reference/rows via this button */}
                  <Button
                    id={`additionalInfoRemoveButton${index}`}
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
      </Col>
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
