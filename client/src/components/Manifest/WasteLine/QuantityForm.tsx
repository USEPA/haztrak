import { HtForm } from 'components/Ht';
import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

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

export function QuantityForm() {
  const { register, control } = useFormContext();

  return (
    <>
      <Row className="mb-2">
        <Col xs={3}>
          <HtForm.Group className="mb-2">
            <HtForm.Label className="mb-0">Number</HtForm.Label>
            <Form.Control
              type="number"
              min={1}
              {...register(`quantity.containerNumber`, { min: 0, valueAsNumber: true })}
            />
          </HtForm.Group>
        </Col>
        <Col>
          <HtForm.Group className="mb-2">
            <HtForm.Label className="mb-0" htmlFor="quantityContainerType">
              Container Type
            </HtForm.Label>
            <Controller
              control={control}
              name={`quantity.containerType`}
              render={({ field }) => {
                return (
                  <Select
                    id="quantityContainerType"
                    {...field}
                    options={containerTypes}
                    getOptionLabel={(option) => option.description}
                    getOptionValue={(option) => option.code}
                    openMenuOnFocus={false}
                  />
                );
              }}
            />
          </HtForm.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <HtForm.Group className="mb-2">
            <HtForm.Label className="mb-0">Quantity</HtForm.Label>
            <Form.Control
              type="number"
              min={1}
              {...register(`quantity.quantity`, {
                valueAsNumber: true,
              })}
            />
          </HtForm.Group>
        </Col>
        <Col>
          <HtForm.Group className="mb-2">
            <HtForm.Label className="mb-0" htmlFor="quantityUnitOfMeasurement">
              Units
            </HtForm.Label>
            <Controller
              control={control}
              name={`quantity.unitOfMeasurement`}
              render={({ field }) => {
                return (
                  <Select
                    id="quantityUnitOfMeasurement"
                    {...field}
                    options={unitsOfMeasurements}
                    getOptionLabel={(option) => option.description}
                    getOptionValue={(option) => option.code}
                    openMenuOnFocus={false}
                  />
                );
              }}
            />
          </HtForm.Group>
        </Col>
      </Row>
    </>
  );
}
