import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HtForm } from 'components/Ht';
import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Manifest } from 'types';
import { WasteLine } from 'types/WasteLine';

interface AdditionalFormProps {
  readOnly?: boolean;
}

// ToDo: this is POC source, clean up work appreciated
//  see this example from react-hook-form
//  https://codesandbox.io/s/6j1760jkjk
function AdditionalInfoForm({ readOnly }: AdditionalFormProps) {
  const { register, control } = useFormContext<Manifest | WasteLine>();
  const { fields, append, remove } = useFieldArray<Manifest | WasteLine, 'additionalInfo.comments'>(
    {
      control,
      name: 'additionalInfo.comments',
    }
  );

  return (
    <>
      <HtForm.Group>
        <HtForm.Label htmlFor="specialHandlingInstructions">
          Special Handling Instructions
        </HtForm.Label>
        <HtForm.Control
          id="specialHandlingInstructions"
          plaintext={readOnly}
          readOnly={readOnly}
          key={'handlingInstructions'}
          as="textarea"
          {...register(`additionalInfo.handlingInstructions`)}
        />
      </HtForm.Group>
      <p className="mb-0 fw-bold">Reference Information</p>
      <Col>
        <Row className="mb-3">
          {fields.map((field, index) => {
            const baseFieldName = `additionalInfo.comments`;
            const keyBase = `${field.id}-${index}`;
            return (
              <Row className="mb-3" key={`${keyBase}-row`}>
                <Col xs={3} key={`${keyBase}-col1`}>
                  {/* column for the Label field */}
                  <HtForm.Group key={`${keyBase}-label-group`}>
                    {/* Only add a label if it's the first row*/}
                    {index === 0 ? (
                      <HtForm.Label htmlFor={`additionalInfoLabel${index}`}>Label</HtForm.Label>
                    ) : (
                      <></>
                    )}
                    <HtForm.Control
                      type="text"
                      id={`additionalInfoLabel${index}`}
                      aria-label={`additionalInfoLabel${index}`}
                      key={`${keyBase}-label`}
                      readOnly={readOnly}
                      plaintext={readOnly}
                      // @ts-ignore
                      {...register(`${baseFieldName}[${index}].label`)}
                    />
                  </HtForm.Group>
                </Col>
                <Col key={`${keyBase}-col2`}>
                  <HtForm.Group key={`${keyBase}-group`}>
                    {index === 0 ? (
                      <HtForm.Label htmlFor={`additionalInfoDescription${index}`}>
                        Description
                      </HtForm.Label>
                    ) : (
                      <></>
                    )}
                    {/* column for the Description field */}
                    <HtForm.Control
                      id={`additionalInfoDescription${index}`}
                      aria-label={`additionalInfoDescription${index}`}
                      type="text"
                      readOnly={readOnly}
                      plaintext={readOnly}
                      key={`${keyBase}-description-group`}
                      // @ts-ignore
                      {...register(`${baseFieldName}[${index}].description`)}
                    />
                  </HtForm.Group>
                </Col>
                <Col xs={1} key={`${keyBase}-col3`}>
                  {index === 0 ? (
                    <HtForm.Label
                      htmlFor={`additionalInfoRemoveButton${index}`}
                      aria-label={`additionalInfoRemoveButton${index}`}
                    >
                      Remove
                    </HtForm.Label>
                  ) : (
                    <></>
                  )}
                  {/* Users can remove a Reference/rows via this button */}
                  <Button
                    id={`additionalInfoRemoveButton${index}`}
                    data-testid="additionalInfoRemoveButton"
                    key={`${keyBase}-remove`}
                    disabled={readOnly}
                    className="m-0 p-0 bg-transparent border-0"
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    <FontAwesomeIcon icon={faTimesCircle} className="fa-lg text-danger" />
                  </Button>
                </Col>
              </Row>
            );
          })}
        </Row>
      </Col>
      <div>
        {readOnly ? (
          <></>
        ) : (
          <Button onClick={() => append({ description: '', label: '' })}>Add Reference</Button>
        )}
      </div>
    </>
  );
}

export default AdditionalInfoForm;
