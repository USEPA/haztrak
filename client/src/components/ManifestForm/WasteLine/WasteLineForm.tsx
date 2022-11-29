import React from 'react';
import { Container, Form, Row, Button } from 'react-bootstrap';
import { useForm, FormProvider } from 'react-hook-form';
import { WasteLine } from 'types/Manifest/WasteLine';
import QuantityForm from './QuantityForm';

function WasteLineForm() {
  const onSubmit = (data: any) => console.log(data);
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
          <Row className="mb-2">
            <Form.Switch
              id="dotHazardousSwitch"
              label="DOT Hazardous Material?"
              {...register('dotHazardous')}
            />
          </Row>
          <Row className="mb-2">
            <Form.Switch
              id="epaWasteSwitch"
              label="EPA Hazardous Waste?"
              {...register('epaWaste')}
            />
          </Row>
          <Row className="mb-2">
            <Form.Switch
              id="psbSwitch"
              label="PCB waste?"
              {...register('pcb')}
            />
          </Row>
          <Row className="mb-2">
            <Form.Group className="mb-2">
              <Form.Label className="mb-0">Waste Description</Form.Label>
              <Form.Control as="textarea" {...register(`wasteDescription`)} />
            </Form.Group>
          </Row>
          <h4>Container and Quantity</h4>
          <Row className="mb-2">
            <QuantityForm />
          </Row>
        </Container>
        <Button type="submit">Submit</Button>
      </Form>
    </FormProvider>
  );
}

export default WasteLineForm;
