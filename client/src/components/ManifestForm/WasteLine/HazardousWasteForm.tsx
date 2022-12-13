import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Controller, useFormContext } from 'react-hook-form';
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
            <Form.Label className="mb-0">Federal Waste Codes</Form.Label>
            {/* We need to use 'Controller' to wrap
              around React-Select's controlled component */}
            {/*https://react-hook-form.com/api/usecontroller/controller*/}
            <Controller
              control={control}
              name="hazardousWaste.federalWasteCodes"
              render={({ field, fieldState, formState }) => {
                return (
                  <Select
                    {...field}
                    onChange={(e) => {
                      let codes: Array<any> = [];
                      for (let i = 0; i < e.length; i++) {
                        codes.push({ code: e[i].value, label: e[i].value });
                      }
                      field.onChange(codes);
                    }}
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
          <Form.Group className="mb-3">
            <Form.Label className="mb-0">Generator State Waste Codes</Form.Label>
            <Controller
              control={control}
              name="hazardousWaste.generatorStateWasteCodes"
              render={({ field }) => {
                return (
                  <Select
                    {...field}
                    // @ts-ignore
                    onChange={(e) => {
                      let codes: Array<any> = [];
                      for (let i = 0; i < e.length; i++) {
                        codes.push({ code: e[i].value, label: e[i].value });
                      }
                      field.onChange(codes);
                    }}
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
          <Form.Group>
            <Form.Label className="mb-0">Destination State Waste Codes</Form.Label>
            <Controller
              control={control}
              name="hazardousWaste.tsdfStateWasteCodes"
              render={({ field }) => {
                return (
                  <Select
                    {...field}
                    onChange={(e) => {
                      let codes: Array<any> = [];
                      console.log(field.value);
                      for (let i = 0; i < e.length; i++) {
                        codes.push({ code: e[i].value, label: e[i].value });
                      }
                      field.onChange(codes);
                    }}
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
