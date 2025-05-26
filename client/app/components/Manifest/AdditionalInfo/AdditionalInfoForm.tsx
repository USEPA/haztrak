import { Button, Col, Form, Row } from 'react-bootstrap';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FaTimesCircle } from 'react-icons/fa';
import { Manifest } from '~/components/Manifest';
import { WasteLine } from '~/components/Manifest/WasteLine';
import { HtForm } from '~/components/legacyUi';
import { useReadOnly } from '~/hooks/manifest';

export function AdditionalInfoForm() {
  const { register, control } = useFormContext<Manifest | WasteLine>();
  const [readOnly] = useReadOnly();
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
        <Form.Control
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
                    <Form.Control
                      type="text"
                      id={`additionalInfoLabel${index}`}
                      aria-label={`additionalInfoLabel${index}`}
                      key={`${keyBase}-label`}
                      readOnly={readOnly}
                      plaintext={readOnly}
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
                    <Form.Control
                      id={`additionalInfoDescription${index}`}
                      aria-label={`additionalInfoDescription${index}`}
                      type="text"
                      readOnly={readOnly}
                      plaintext={readOnly}
                      key={`${keyBase}-description-group`}
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
                  {/* remove Reference/rows */}
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
                    <FaTimesCircle className="fa-lg text-danger" />
                  </Button>
                </Col>
              </Row>
            );
          })}
        </Row>
      </Col>
      <div className="d-flex justify-content-end ">
        {readOnly ? (
          <></>
        ) : (
          <Button
            variant="outline-secondary"
            onClick={() => append({ description: '', label: '' })}
          >
            Add Reference
          </Button>
        )}
      </div>
    </>
  );
}
