import AdditionalInfoForm from 'components/ManifestForm/AdditionalInfo';
import HazardousWasteForm from 'components/ManifestForm/WasteLine/HazardousWasteForm';
import React from 'react';
import { Button, Container, Form, Row } from 'react-bootstrap';
import { FormProvider, UseFieldArrayAppend, useForm } from 'react-hook-form';
import { Manifest } from 'types';
import { WasteLine } from 'types/WasteLine';
import QuantityForm from './QuantityForm';
import HtCard from 'components/HtCard';

interface WasteLineFormProps {
  handleClose: () => void;
  currentWastes?: Array<WasteLine>;
  appendWaste: UseFieldArrayAppend<Manifest, 'wastes'>;
}

/**
 * WasteLineForm is the top level component/form for adding wastes to
 * the uniform hazardous waste manifest.
 * @constructor
 */
function WasteLineForm({ handleClose, appendWaste }: WasteLineFormProps) {
  // ToDo: on submit, add new WasteLine object to the ManifestForm. we'll need
  //  to add another useFieldArray hook for the 'wastes' field in the ManifestForm
  //  and pass the necessary methods to this component (like we did the TransporterForm)
  const onSubmit = (data: WasteLine) => {
    appendWaste(data);
    handleClose();
  };
  const wasteMethods = useForm<WasteLine>();
  const { register, handleSubmit, setFocus } = wasteMethods;

  return (
    <FormProvider {...wasteMethods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Container>
          <HtCard border={'secondary'}>
            <HtCard.Body>
              <h5>General Information</h5>
              <Container className="ms-2">
                <Row>
                  <Form.Switch
                    id="dotHazardousSwitch"
                    label="DOT Hazardous Material?"
                    {...register('dotHazardous')}
                    autoFocus
                  />
                </Row>
                <Row>
                  <Form.Switch
                    id="epaWasteSwitch"
                    label="EPA Hazardous Waste?"
                    {...register('epaWaste')}
                  />
                </Row>
                <Row>
                  <Form.Switch
                    id="pcbSwitch"
                    aria-label="PCBWaste"
                    label="PCB waste?"
                    {...register('pcb')}
                  />
                </Row>
              </Container>
              <Row>
                <Form.Group>
                  <Form.Label className="mb-0" htmlFor="wasteDescription">
                    Waste Description
                  </Form.Label>
                  <Form.Control
                    id="wasteDescription"
                    as="textarea"
                    {...register(`wasteDescription`)}
                  />
                </Form.Group>
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
                WasteLineForm or ManifestForm (e.g., surrounded by FormProvider*/}
                <AdditionalInfoForm />
              </Row>
            </HtCard.Body>
          </HtCard>
        </Container>
        <div className="d-flex justify-content-end">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="success" className="mx-3">
            Add Waste Line
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
}

export default WasteLineForm;
