import { zodResolver } from '@hookform/resolvers/zod';
import { HtCard, HtForm } from 'components/Ht';
import { AdditionalInfoForm } from 'components/AdditionalInfo/AdditionalInfoForm';
import { HazardousWasteForm } from './HazardousWasteForm';
import React from 'react';
import { Button, Container, Form, Row } from 'react-bootstrap';
import { FormProvider, UseFieldArrayAppend, useForm } from 'react-hook-form';
import { Manifest } from 'components/Manifest/manifestSchema';
import { WasteLine, wasteLineSchema } from 'components/Manifest/WasteLine/wasteLineSchema';
import { QuantityForm } from './QuantityForm';

interface WasteLineFormProps {
  handleClose: () => void;
  currentWastes?: Array<WasteLine>;
  appendWaste: UseFieldArrayAppend<Manifest, 'wastes'>;
}

const wasteLineDefaultValues: Partial<WasteLine> = {
  dotHazardous: true,
  epaWaste: false,
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
  const wasteMethods = useForm<WasteLine>({
    resolver: zodResolver(wasteLineSchema),
    defaultValues: { ...wasteLineDefaultValues, lineNumber: newLineNumber },
  });
  const { register, handleSubmit } = wasteMethods;

  console.log(wasteMethods.formState.errors);

  /**
   * onSubmit is the callback function for the form submission.
   * @param data
   */
  const onSubmit = (data: WasteLine) => {
    appendWaste(data); // append the new waste line to the manifest
    handleClose();
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
                  <HtForm.Switch
                    id="dotHazardousSwitch"
                    label="DOT Hazardous Material?"
                    {...register('dotHazardous')}
                    // autoFocus
                  />
                </Row>
                <Row>
                  <HtForm.Switch
                    id="epaWasteSwitch"
                    label="EPA Hazardous Waste?"
                    {...register('epaWaste')}
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
              <Row>
                <HtForm.Group>
                  <HtForm.Label htmlFor="wasteDescription">Waste Description</HtForm.Label>
                  <Form.Control
                    id="wasteDescription"
                    as="textarea"
                    {...register(`wasteDescription`)}
                  />
                </HtForm.Group>
              </Row>
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
                <HazardousWasteForm />
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
