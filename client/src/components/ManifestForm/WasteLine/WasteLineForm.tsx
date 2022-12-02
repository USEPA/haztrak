import AdditionalInfoForm from 'components/ManifestForm/AdditionalInfo';
import HazardousWasteForm from 'components/ManifestForm/WasteLine/HazardousWasteForm';
import React from 'react';
import { Container, Form, Row, Button } from 'react-bootstrap';
import { useForm, FormProvider } from 'react-hook-form';
import { WasteLine } from 'types/WasteLine';
import QuantityForm from './QuantityForm';
import HtCard from 'components/HtCard';

/**
 * WasteLineForm is the top level component/form for adding wastes to
 * the uniform hazardous waste manifest.
 * @constructor
 */
function WasteLineForm() {
  // ToDo: on submit, add new WasteLine object to the ManifestForm. we'll need
  //  to add another useFieldArray hook for the 'wastes' field in the ManifestForm
  //  and pass the necessary methods to this component (like we did the TransporterForm)
  const onSubmit = (data: WasteLine) => console.log(data);
  // const {
  //   register,
  //   watch,
  //   handleSubmit,
  //   formState: { errors },
  // } = useFormContext();
  const wasteMethods = useForm<WasteLine>();
  const { register, handleSubmit } = wasteMethods;
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
                    id="psbSwitch"
                    label="PCB waste?"
                    {...register('pcb')}
                  />
                </Row>
              </Container>
              <Row>
                <Form.Group>
                  <Form.Label className="mb-0">Waste Description</Form.Label>
                  <Form.Control
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
        <Button type="submit">Submit</Button>
      </Form>
    </FormProvider>
  );
}

export default WasteLineForm;
