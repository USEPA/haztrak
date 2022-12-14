import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

// ToDo: For development, replace with hook to fetch real codes
const options = [
  { code: 'D001', description: 'D001' },
  { code: 'D002', description: 'D002' },
  { code: 'D003', description: 'D003' },
  { code: 'D004', description: 'D004' },
  { code: 'D005', description: 'D005' },
  { code: 'F001', description: 'F001' },
  { code: 'F002', description: 'F002' },
  { code: 'F003', description: 'F003' },
];

function HazardousWasteForm() {
  const { control } = useFormContext();

  return (
    <>
      <Row className="mb-2">
        <Col>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0" htmlFor="hazardousWasteFederalWasteCodes">
              Federal Waste Codes
            </Form.Label>
            {/* We need to use 'Controller' to wrap
              around React-Select's controlled component */}
            {/*https://react-hook-form.com/api/usecontroller/controller*/}
            <Controller
              control={control}
              name="hazardousWaste.federalWasteCodes"
              render={({ field }) => {
                return (
                  <Select
                    id="hazardousWasteFederalWasteCodes"
                    {...field}
                    options={options}
                    getOptionLabel={(option) => option.code}
                    getOptionValue={(option) => option.code}
                    openMenuOnFocus={false}
                    isMulti
                    isClearable
                    hideSelectedOptions
                  />
                );
              }}
            ></Controller>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="mb-0" htmlFor="hazardousWasteGeneratorStateCodes">
              Generator State Waste Codes
            </Form.Label>
            <Controller
              control={control}
              name="hazardousWaste.generatorStateWasteCodes"
              render={({ field }) => {
                return (
                  <Select
                    id="hazardousWasteGeneratorStateCodes"
                    {...field}
                    options={options}
                    getOptionLabel={(option) => option.code}
                    getOptionValue={(option) => option.code}
                    openMenuOnFocus={false}
                    isMulti
                    isClearable
                    hideSelectedOptions
                  />
                );
              }}
            ></Controller>
          </Form.Group>
          <Form.Group>
            <Form.Label className="mb-0" htmlFor="hazardousWasteTsdfCodes">
              Destination State Waste Codes
            </Form.Label>
            <Controller
              control={control}
              name="hazardousWaste.tsdfStateWasteCodes"
              render={({ field }) => {
                return (
                  <Select
                    id="hazardousWasteTsdfCodes"
                    {...field}
                    getOptionLabel={(option) => option.code}
                    getOptionValue={(option) => option.code}
                    options={options}
                    openMenuOnFocus={false}
                    isMulti
                    isClearable
                    hideSelectedOptions
                  />
                );
              }}
            ></Controller>
          </Form.Group>
        </Col>
      </Row>
    </>
  );
}

export default HazardousWasteForm;
