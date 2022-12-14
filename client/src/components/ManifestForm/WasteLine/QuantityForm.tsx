import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

const unitsOfMeasurements = [
  { code: 'P', description: 'Pounds' },
  { code: 'T', description: 'Tons (2000 Pounds)' },
  { code: 'K', description: 'Kilograms' },
  { code: 'M', description: 'Metric Tons (1000 Kilograms)' },
  { code: 'G', description: 'Gallons' },
  { code: 'L', description: 'Liters' },
  { code: 'Y', description: 'Cubic Yards' },
  { code: 'N', description: 'Cubic Meters' },
];

const containerTypes = [
  { code: 'BA', description: 'Burlap, cloth, paper, or plastic bags' },
  { code: 'DT', description: 'Dump truck' },
  { code: 'CF', description: 'Fiber or plastic boxes, cartons, cases' },
  { code: 'DW', description: 'Wooden drums, barrels, kegs' },
  { code: 'CM', description: 'Metal boxes, cartons, cases (including roll offs)' },
  { code: 'HG', description: 'Hopper or gondola cars' },
  { code: 'CW', description: 'Wooden boxes, cartons, cases' },
  { code: 'TC', description: 'Tank cars' },
  { code: 'CY', description: 'Cylinders' },
  { code: 'TP', description: 'Portable tanks' },
  { code: 'DF', description: 'Fiberboard or plastic drums, barrels, kegs' },
  { code: 'TT', description: 'Cargo tanks (tank trucks)' },
  { code: 'DM', description: 'Metal drums, barrels, kegs' },
];

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
              {containerTypes.map((unit, index) => {
                return (
                  <option key={`cd-${index}`} value={String(unit.code)}>
                    {`${unit.code} - ${unit.description}`}
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
              {unitsOfMeasurements.map((unit, index) => {
                return (
                  <option key={`cd-${index}`} value={unit.code}>
                    {`${unit.code} - ${unit.description}`}
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
