import { zodResolver } from '@hookform/resolvers/zod';
import { AdditionalInfoForm } from 'components/AdditionalInfo/AdditionalInfoForm';
import { HtCard, HtForm } from 'components/Ht';
import { Manifest } from 'components/Manifest/manifestSchema';
import { dotIdNumbers } from 'components/Manifest/WasteLine/dotInfo';
import { HazardousWasteForm } from 'components/Manifest/WasteLine/HazardousWasteForm';
import { WasteLine, wasteLineSchema } from 'components/Manifest/WasteLine/wasteLineSchema';
import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Controller, FormProvider, UseFieldArrayAppend, useForm } from 'react-hook-form';
import { QuantityForm } from './QuantityForm';

interface WasteLineFormProps {
  handleClose: () => void;
  currentWastes?: Array<WasteLine>;
  appendWaste: UseFieldArrayAppend<Manifest, 'wastes'>;
}

const wasteLineDefaultValues: Partial<WasteLine> = {
  dotHazardous: true,
  // @ts-ignore
  quantity: { containerNumber: 1, quantity: 1 },
};

/**
 * WasteLineForm is the top level component/form for adding wastes to
 * the uniform hazardous waste manifest.
 * @constructor
 */
export function WasteLineForm({ handleClose, appendWaste, currentWastes }: WasteLineFormProps) {
  const newLineNumber = currentWastes ? currentWastes.length + 1 : 1;
  const [dotHazardous, setDotHazardous] = React.useState<boolean>(true);
  const [epaWaste, setEpaWaste] = React.useState<boolean>(true);
  const wasteMethods = useForm<WasteLine>({
    resolver: zodResolver(wasteLineSchema),
    defaultValues: {
      ...wasteLineDefaultValues,
      dotHazardous: dotHazardous,
      epaWaste: epaWaste,
      lineNumber: newLineNumber,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = wasteMethods;

  /**
   * onSubmit is the callback function for the form submission.
   * @param wasteLine the data submitted from the form
   */
  const onSubmit = (wasteLine: WasteLine) => {
    appendWaste(wasteLine); // append the new waste line to the manifest
    handleClose();
    console.log('dotInformation', wasteLine.dotInformation);
  };

  return (
    <FormProvider {...wasteMethods}>
      <HtForm onSubmit={handleSubmit(onSubmit)}>
        <Container>
          <HtCard border={'secondary'}>
            <HtCard.Body>
              <h5>General Information</h5>
              <Container className="ms-2">
                <Row>
                  <Controller
                    control={wasteMethods.control}
                    name={'dotHazardous'}
                    render={({ field }) => (
                      <HtForm.Switch
                        id="dotHazardousSwitch"
                        label="DOT Hazardous Material?"
                        {...register('dotHazardous')}
                        onChange={(e) => setDotHazardous(e.target.checked)}
                      />
                    )}
                  />
                </Row>
                <Row>
                  <Controller
                    control={wasteMethods.control}
                    name={'epaWaste'}
                    render={({ field }) => (
                      <HtForm.Switch
                        id="epaWasteSwitch"
                        label="EPA Hazardous Waste?"
                        {...register('epaWaste')}
                        onChange={(e) => setEpaWaste(e.target.checked)}
                      />
                    )}
                  />
                </Row>
                <Row>
                  <HtForm.Switch
                    id="pcbSwitch"
                    aria-label="PCBWaste"
                    label="PCB waste?"
                    {...register('pcb')}
                  />
                </Row>
                <Row>
                  <HtForm.Switch
                    id="brSwitch"
                    aria-label="biennialReport"
                    label="Supply Biennial Report (BR) data?"
                    {...register('br')}
                  />
                </Row>
              </Container>
              {!dotHazardous && (
                <Row>
                  <HtForm.Group>
                    <HtForm.Label htmlFor="wasteDescription">Waste Description</HtForm.Label>
                    <Form.Control
                      id="wasteDescription"
                      as="textarea"
                      className={errors.wasteDescription && 'is-invalid'}
                      {...register(`wasteDescription`)}
                    />
                    <div className="invalid-feedback">{errors.wasteDescription?.message}</div>
                  </HtForm.Group>
                </Row>
              )}
              {dotHazardous && (
                <Row>
                  <Col xs={9}>
                    <HtForm.Group>
                      <HtForm.Label htmlFor="dotDescription">DOT Description</HtForm.Label>
                      <Form.Control
                        id="dotDescription"
                        as="textarea"
                        {...register(`dotInformation.printedDotInformation`)}
                        className={errors.dotInformation?.printedDotInformation && 'is-invalid'}
                      />
                      <div className="invalid-feedback">
                        {errors.dotInformation?.printedDotInformation?.message}
                      </div>
                    </HtForm.Group>
                  </Col>
                  <Col>
                    <HtForm.Group>
                      <HtForm.Label htmlFor="dotDescription">DOT ID Number</HtForm.Label>
                      <Form.Select
                        id="dotIdNumber"
                        as="input"
                        defaultValue={''}
                        {...register(`dotInformation.idNumber.code`)}
                        className={errors.dotInformation?.idNumber && 'is-invalid'}
                      >
                        <option value="">Select ID Number</option>
                        {dotIdNumbers.map((idNumber) => (
                          <option key={idNumber} value={idNumber}>
                            {idNumber}
                          </option>
                        ))}
                      </Form.Select>
                      <div className="invalid-feedback">
                        {errors.dotInformation?.idNumber?.code?.message}
                      </div>
                    </HtForm.Group>
                  </Col>
                </Row>
              )}
            </HtCard.Body>
          </HtCard>
          <HtCard border={'secondary'}>
            <HtCard.Body>
              <h5>Container and Quantity</h5>
              <Row className="mb-2">
                <QuantityForm />
              </Row>
            </HtCard.Body>
          </HtCard>
          <HtCard border={'secondary'}>
            <HtCard.Body>
              <h5>Waste Codes</h5>
              <Row className="mb-2">
                <HazardousWasteForm epaWaste={epaWaste} />
              </Row>
            </HtCard.Body>
          </HtCard>
          <HtCard border={'secondary'}>
            <HtCard.Body>
              <h5>Special Handing Instructions and Additional Info</h5>
              <Row className="mb-2">
                {/* AdditionalInfoForm needs to be used in the context of a
                WasteLineForm or Manifest (e.g., surrounded by FormProvider*/}
                <AdditionalInfoForm />
              </Row>
            </HtCard.Body>
          </HtCard>
        </Container>
        <div className="d-flex justify-content-end">
          <Button variant="danger" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="success" className="mx-3">
            Add
          </Button>
        </div>
      </HtForm>
    </FormProvider>
  );
}
