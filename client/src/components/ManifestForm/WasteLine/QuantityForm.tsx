import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { ContainerCode, QuantityCode } from 'types/WasteLine';
import {
  ContainerCodeValues,
  ContainerDescriptionValues,
  QuantityCodeValues,
  QuantityDescriptionValues,
} from 'types/WasteLine/WasteLine';

type CC = keyof typeof ContainerCode;
type QC = keyof typeof QuantityCode;

function QuantityForm() {
  const { register } = useFormContext();

  return (
    <>
      <Row className="mb-2">
        <Col xs={3}>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">Container Number</Form.Label>
            <Form.Control
              type="number"
              {...register(`quantity.containerNumber`, { min: 0, valueAsNumber: true })}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">Container Type</Form.Label>
            <Form.Select {...register(`quantity.containerType`)}>
              {(Object.keys(ContainerCodeValues) as Array<CC>).map((cc, index) => {
                const contDescription = ContainerDescriptionValues[cc];
                return (
                  <option key={`cc-${index}`} value={String(cc)}>
                    {`${String(cc)} - ${contDescription}`}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">Total Quantity</Form.Label>
            <Form.Control
              type="number"
              {...register(`quantity.quantity`, {
                min: 0,
                valueAsNumber: true,
              })}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">Units</Form.Label>
            <Form.Select {...register(`quantity.unitOfMeasurement`)}>
              {(Object.keys(QuantityCodeValues) as Array<QC>).map((qc, index) => {
                const quantityDescription = QuantityDescriptionValues[qc];
                return (
                  <option key={`cc-${index}`} value={String(qc)}>
                    {`${String(qc)} - ${quantityDescription}`}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </>
  );
}

export default QuantityForm;
