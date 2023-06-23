import { HtForm } from 'components/Ht';
import React, { useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Controller, useFormContext } from 'react-hook-form';
import Select, { components, GroupBase, MultiValueProps, StylesConfig } from 'react-select';
import { useGetFedWasteCodesQuery, useGetStateWasteCodesQuery } from 'store/wasteCode.slice';
import { Code } from 'components/Manifest/WasteLine/wasteLineSchema';
import { ManifestContext, ManifestContextType } from 'components/Manifest/ManifestForm';
import { StateWasteCodeSelect } from 'components/Manifest/WasteLine/HazardousWasteForm/StateWasteCodeSelect';

// ToDo: For temporary development purposes, We retrieve federal wastes codes
//  but still need to implement state waste codes on backend
const options = [
  {
    code: '121',
    description: 'Alkaline solution (pH >12.5) with metals ',
  },
  {
    code: '122',
    description: 'Alkaline solution without metals (pH > 12.5)',
  },
  {
    code: '123',
    description: 'Unspecified alkaline solution',
  },
  {
    code: '131',
    description: 'Aqueous solution (2 < pH < 12.5) containing reactive anions',
  },
  {
    code: '132',
    description: 'Aqueous solution w/metals ',
  },
];

/**
 * Returns a form for adding waste code(s), to a wasteline, for a given manifest.
 * It expects to be within the context of a manifest form.
 * @constructor
 */
export function HazardousWasteForm() {
  const { control } = useFormContext();
  const { generatorStateCode } = useContext<ManifestContextType>(ManifestContext);
  // Retrieve federal waste codes from the server
  const {
    data: federalWasteCodes,
    isLoading: federalLoading,
    error: federalError,
  } = useGetFedWasteCodesQuery();

  /**
   * Styles for our waste code react-select dropdowns
   */
  const wasteCodeStyles: StylesConfig<Code, true> = {
    multiValue: (baseStyle) => ({
      ...baseStyle,
      borderRadius: '5px',
    }),
    // leaving this here as documentation
    multiValueRemove: (baseStyle, state: MultiValueProps<Code, true, GroupBase<Code>>) => ({
      ...baseStyle,
      borderRadius: '5px',
      ':hover': {
        backgroundColor: '#e6151580',
      },
    }),
  };

  /**
   * This is a custom component we use to display waste codes so that the full
   * description of the waste code is present when selecting from the dropdown
   * but only contains the ~4-digit code once selected.
   * see SO question here
   * https://stackoverflow.com/questions/52482985/react-select-show-different-text-label-for-drop-down-and-control
   */
  const MultiValue = (props: any) => (
    <components.MultiValue {...props}>{props.data.code}</components.MultiValue>
  );

  return (
    <>
      <Row className="mb-2">
        <Col>
          <HtForm.Group className="mb-2">
            <HtForm.Label className="mb-0" htmlFor="hazardousWasteFederalWasteCodes">
              Federal Waste Codes
            </HtForm.Label>
            {/* Federal waste code selection*/}
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
                    getOptionLabel={(option) =>
                      `${option.code}: ${option.description.toLowerCase()}`
                    }
                    getOptionValue={(option) => option.code}
                    styles={wasteCodeStyles}
                    components={{ MultiValue }}
                    openMenuOnFocus={false}
                    isMulti
                    isClearable
                    hideSelectedOptions
                  />
                );
              }}
            ></Controller>
            {federalError ? (
              <i className="text-danger">
                We experienced an error retrieving the federal waste codes
              </i>
            ) : (
              <></>
            )}
          </HtForm.Group>
          <HtForm.Group className="mb-3">
            <HtForm.Label className="mb-0" htmlFor="hazardousWasteGeneratorStateCodes">
              Generator State Waste Codes
            </HtForm.Label>
            {/* Generator state waste selection */}
            <StateWasteCodeSelect
              stateId={generatorStateCode}
              fieldName="hazardousWaste.generatorStateWasteCodes"
            />
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
            />
          </HtForm.Group>
        </Col>
      </Row>
    </>
  );
}
