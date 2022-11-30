import { Row, Form, Col } from 'react-bootstrap';
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Select from 'react-select';

// ToDo: For development, replace with hook to fetch real codes
const options = [
  { value: 'D001', label: 'D001' },
  { value: 'D002', label: 'D002' },
  { value: 'D003', label: 'D003' },
  { value: 'D004', label: 'D004' },
  { value: 'D005', label: 'D005' },
  { value: 'F001', label: 'F001' },
  { value: 'F002', label: 'F002' },
  { value: 'F003', label: 'F003' },
];

function HazardousWasteForm() {
  const { control } = useFormContext();

  return (
    <>
      <Row className="mb-2">
        <Col>
          <Form.Group className="mb-2">
            <div className="mb-3">
              <Form.Label className="mb-0">Federal Waste Codes</Form.Label>
              {/* We need to use 'Controller' to wrap
              around React-Select's controlled component */}
              {/*https://react-hook-form.com/api/usecontroller/controller*/}
              <Controller
                control={control}
                name="hazardousWaste.federalWasteCodes"
                render={({ field, fieldState, formState }) => {
                  // There's not a good way to assign just the value from the
                  // options, we need to clean the data before sending to the server
                  return (
                    <Select
                      {...field} // spread the onChange, onBlur, value, and ref fields
                      options={options}
                      openMenuOnFocus={false}
                      isMulti
                      isClearable
                      hideSelectedOptions
                    />
                  );
                }}
              ></Controller>
            </div>
            <div className="mb-3">
              <Form.Label>Generator State Waste Codes</Form.Label>
              <Controller
                control={control}
                name="hazardousWaste.generatorStateWasteCodes"
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      options={options}
                      openMenuOnFocus={false}
                      isMulti
                      isClearable
                      hideSelectedOptions
                    />
                  );
                }}
              ></Controller>
            </div>
            <div className="mb-3">
              <Form.Label>Destination State Waste Codes</Form.Label>
              <Controller
                control={control}
                name="hazardousWaste.tsdfStateWasteCodes"
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      options={options}
                      openMenuOnFocus={false}
                      isMulti
                      isClearable
                      hideSelectedOptions
                    />
                  );
                }}
              ></Controller>
            </div>
          </Form.Group>
        </Col>
      </Row>
    </>
  );
}

export default HazardousWasteForm;
