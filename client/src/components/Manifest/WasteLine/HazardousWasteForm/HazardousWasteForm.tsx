import { ErrorMessage } from '@hookform/error-message';
import React, { useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Controller, useFormContext } from 'react-hook-form';
import Select, { components, StylesConfig } from 'react-select';
import { ManifestContext, ManifestContextType } from '~/components/Manifest/ManifestForm';
import { StateWasteCodeSelect } from '~/components/Manifest/WasteLine/HazardousWasteForm/StateWasteCodeSelect';
import { Code, WasteLine } from '~/components/Manifest/WasteLine/wasteLineSchema';
import { HtForm } from '~/components/legacyUi';
import { useGetFedWasteCodesQuery } from '~/store';

interface HazardousWasteFormProps {
  epaWaste: boolean;
}

/**
 * Returns a form for adding waste code(s), to a wasteline, for a given manifest.
 * It expects to be within the context of a manifest form.
 * @constructor
 */
export function HazardousWasteForm({ epaWaste }: HazardousWasteFormProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<WasteLine>();
  const { generatorStateCode, tsdfStateCode } = useContext<ManifestContextType>(ManifestContext);
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
    multiValueRemove: (baseStyle) => ({
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
                    aria-label="Federal Waste Codes"
                    isDisabled={!epaWaste}
                    options={federalWasteCodes}
                    isLoading={federalLoading}
                    getOptionLabel={(option) =>
                      // @ts-expect-error - we know option is a Code
                      `${option.code}: ${option.description.toLowerCase()}`
                    }
                    getOptionValue={(option) => option.code}
                    styles={wasteCodeStyles}
                    components={{ MultiValue }}
                    openMenuOnFocus={false}
                    isMulti
                    isClearable
                    hideSelectedOptions
                    classNames={{
                      control: () =>
                        `form-control p-0 rounded-2 ${
                          errors.hazardousWaste?.federalWasteCodes && 'border-danger'
                        } `,
                    }}
                  />
                );
              }}
            />
            <ErrorMessage
              errors={errors}
              name={'hazardousWaste.federalWasteCodes'}
              render={({ message }) => <span className="text-danger">{message}</span>}
            />
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
            {/* Generator state waste selection */}
            <StateWasteCodeSelect
              stateId={tsdfStateCode}
              fieldName="hazardousWaste.tsdfStateWasteCodes"
            />
          </HtForm.Group>
        </Col>
      </Row>
    </>
  );
}
