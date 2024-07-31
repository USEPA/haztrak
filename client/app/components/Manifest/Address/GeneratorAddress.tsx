import { ErrorMessage } from '@hookform/error-message';
import { CountryCode, StateCode } from '~/components/Manifest/Address/StateSelect';
import { ManifestContext, ManifestContextType } from '~/components/Manifest/ManifestForm';
import { Manifest } from '~/components/Manifest/manifestSchema';
import { RcraAddress } from '~/components/RcraSite';
import { HtForm } from '~/components/UI';
import React, { useContext } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Controller, FieldError, FieldErrorsImpl, Merge, useFormContext } from 'react-hook-form';
import Select from 'react-select';

interface GeneratorAddressProps {
  addressType: 'siteAddress' | 'mailingAddress';
  readOnly?: boolean;
}

/**
 * AddressForm can be used to set a Handler's mailingAddress or siteAddress
 * Needs to be used in the context of a FormProvider
 */
export function GeneratorAddress({ addressType, readOnly }: GeneratorAddressProps) {
  const { setGeneratorStateCode } = useContext<ManifestContextType>(ManifestContext);
  const {
    getValues,
    control,
    register,
    formState: { errors },
  } = useFormContext<Manifest>();

  // Destructure the address errors from handlerErrors depending on whether this is form for
  // manifest the handler's site address or mailing address.
  let addressErrors: Merge<FieldError, FieldErrorsImpl<RcraAddress>> | undefined = undefined;
  addressErrors = errors.generator?.siteAddress;
  if (addressType === 'mailingAddress') {
    addressErrors = errors.generator?.mailingAddress;
  }

  return (
    <>
      <Row className="mb-2">
        <Col xs={3}>
          <HtForm.Group>
            <HtForm.Label htmlFor="addressStreetNumber">Street Number</HtForm.Label>
            <Form.Control
              id="addressStreetNumber"
              type="text"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder="1234"
              {...register(`generator.${addressType}.streetNumber`)}
            />
          </HtForm.Group>
        </Col>
        <Col xs={5}>
          <HtForm.Group>
            <HtForm.Label htmlFor="addressStreetName">Street Name</HtForm.Label>
            <Form.Control
              id="addressStreetName"
              type="text"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder="Main St."
              {...register(`generator.${addressType}.address1`)}
              className={addressErrors?.address1 && 'is-invalid'}
            />
            <div className="invalid-feedback">{addressErrors?.address1?.message}</div>
          </HtForm.Group>
        </Col>
        <Col>
          <HtForm.Group>
            <HtForm.Label htmlFor="addressCity">City</HtForm.Label>
            <Form.Control
              id="addressCity"
              type="text"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder="Springfield"
              {...register(`generator.${addressType}.city`)}
              className={addressErrors?.city && 'is-invalid'}
            />
            <div className="invalid-feedback">{addressErrors?.city?.message}</div>
          </HtForm.Group>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col>
          <HtForm.Group className="mb-2">
            <HtForm.Label className="mb-0" htmlFor={`generator.${addressType}.State`}>
              State
            </HtForm.Label>
            {readOnly ? (
              <p className="mt-2">{getValues(`generator.${addressType}.state.name`)}</p>
            ) : (
              <Controller
                control={control}
                name={`generator.${addressType}.state`}
                render={({ field }) => {
                  return (
                    <Select
                      id={`generator${addressType}State`}
                      {...field}
                      options={StateCode}
                      getOptionLabel={(option) => option.name ?? 'error'}
                      getOptionValue={(option) => option.code}
                      openMenuOnFocus={false}
                      isDisabled={readOnly}
                      onChange={(option) => {
                        // on selection, set to the selected state object ({code: 'CA', name: 'California'})
                        field.onChange(option);
                        // if address type is siteAddress
                        if (option && addressType === 'siteAddress') {
                          // set the generator state to the selected state code ('CA')
                          setGeneratorStateCode(option.code);
                        }
                      }}
                      classNames={{
                        control: () =>
                          `form-control p-0 rounded-2 ${addressErrors?.state && 'border-danger'} `,
                      }}
                    />
                  );
                }}
              />
            )}
            <ErrorMessage
              errors={errors}
              name={`generator.${addressType}.state`}
              render={({ message }) => <span className="text-danger">{message}</span>}
            />
          </HtForm.Group>
        </Col>
        <Col xs={2}>
          <HtForm.Group>
            <HtForm.Label className="mb-0" htmlFor="addressZip">
              Zip
            </HtForm.Label>
            <Form.Control
              id="addressZip"
              type="text"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder="12345"
              {...register(`generator.${addressType}.zip`)}
              className={addressErrors?.zip && 'is-invalid'}
            />
            <div className="invalid-feedback">{addressErrors?.zip?.message}</div>
          </HtForm.Group>
        </Col>
        <Col>
          <HtForm.Group className="mb-2">
            <HtForm.Label className="mb-0" htmlFor={`generator.${addressType}Country`}>
              Country
            </HtForm.Label>
            {readOnly ? (
              <p className="mt-2">{getValues(`generator.${addressType}.country.name`)}</p>
            ) : (
              <Controller
                control={control}
                name={`generator.${addressType}.country`}
                render={({ field }) => {
                  return (
                    <Select
                      id={`generator.${addressType}Country`}
                      {...field}
                      defaultValue={CountryCode[0]}
                      options={CountryCode}
                      getOptionLabel={(option) => option.name ?? 'error'}
                      getOptionValue={(option) => option.code}
                      openMenuOnFocus={false}
                      isDisabled={readOnly}
                      classNames={{
                        control: () =>
                          `form-control p-0 rounded-2 ${
                            addressErrors?.country && 'border-danger'
                          } `,
                      }}
                    />
                  );
                }}
              />
            )}
            <ErrorMessage
              errors={errors}
              name={`generator.${addressType}.country`}
              render={({ message }) => <span className="text-danger">{message}</span>}
            />
          </HtForm.Group>
        </Col>
      </Row>
    </>
  );
}
