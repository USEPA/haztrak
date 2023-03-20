import { HtForm } from 'components/Ht';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';
import useHtAPI from 'hooks/useHtAPI';
import { Code } from 'types/wasteLine';

// ToDo: For development, We currently have the federal wastes codes implemented
//  but not for generator and TSD state waste codes
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
  const [federalWasteCodes, federalLoading, federalError] =
    useHtAPI<Array<Code>>('trak/code/waste/federal');
  console.log(federalWasteCodes);

  return (
    <>
      <Row className="mb-2">
        <Col>
          <HtForm.Group className="mb-2">
            <HtForm.Label className="mb-0" htmlFor="hazardousWasteFederalWasteCodes">
              Federal Waste Codes
            </HtForm.Label>
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
                    options={federalWasteCodes}
                    isLoading={federalLoading}
                    getOptionLabel={(option) => option.code}
                    getOptionValue={(option) => option.description}
                    openMenuOnFocus={false}
                    isMulti
                    isClearable
                    hideSelectedOptions
                  />
                );
              }}
            ></Controller>
          </HtForm.Group>
          <HtForm.Group className="mb-3">
            <HtForm.Label className="mb-0" htmlFor="hazardousWasteGeneratorStateCodes">
              Generator State Waste Codes
            </HtForm.Label>
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
          </HtForm.Group>
          <HtForm.Group>
            <HtForm.Label className="mb-0" htmlFor="hazardousWasteTsdfCodes">
              Destination State Waste Codes
            </HtForm.Label>
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
          </HtForm.Group>
        </Col>
      </Row>
    </>
  );
}

export default HazardousWasteForm;
