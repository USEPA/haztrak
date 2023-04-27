import { ErrorMessage } from '@hookform/error-message';
import { HtForm } from 'components/Ht';
import { Manifest } from 'components/Manifest/manifestSchema';
import { RcraAddress } from 'components/RcraSite';
import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Controller, FieldError, FieldErrorsImpl, Merge, useFormContext } from 'react-hook-form';
import Select from 'react-select';
import { CountryCode, StateCode } from './StateSelect';

interface Props {
  addressType: 'siteAddress' | 'mailingAddress';
  handlerType: 'generator' | 'designatedFacility';
  readOnly?: boolean;
}

/**
 * AddressForm can be used to set a Handler's mailingAddress or siteAddress
 * Needs to be used in the context of a FormProvider
 */
export function AddressForm({ addressType, handlerType, readOnly }: Props) {
  const {
    getValues,
    control,
    register,
    formState: { errors },
  } = useFormContext<Manifest>();

  // Destructure the handler errors depending on whether this is form for
  // manifest generator of designated facility for use in the form.
  let handlerErrors = errors.generator;
  if (handlerType === 'designatedFacility') {
    handlerErrors = errors.designatedFacility;
  }

  // Destructure the address errors from handlerErrors depending on whether this is form for
  // manifest the handler's site address or mailing address.
  let addressErrors: Merge<FieldError, FieldErrorsImpl<RcraAddress>> | undefined = undefined;
  if (handlerErrors) {
    addressErrors = handlerErrors.siteAddress;
    if (addressType === 'mailingAddress') {
      addressErrors = handlerErrors.mailingAddress;
    }
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
              {...register(`${handlerType}.${addressType}.streetNumber`)}
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
              {...register(`${handlerType}.${addressType}.address1`)}
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
              {...register(`${handlerType}.${addressType}.city`)}
              className={addressErrors?.city && 'is-invalid'}
            />
            <div className="invalid-feedback">{addressErrors?.city?.message}</div>
          </HtForm.Group>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col>
          <HtForm.Group className="mb-2">
            <HtForm.Label className="mb-0" htmlFor={`${handlerType}.${addressType}.State`}>
              State
            </HtForm.Label>
            {readOnly ? (
              <p className="mt-2">{getValues(`${handlerType}.${addressType}.state.name`)}</p>
            ) : (
              <Controller
                control={control}
                name={`${handlerType}.${addressType}.state`}
                render={({ field }) => {
                  return (
                    <Select
                      id={`${handlerType}${addressType}State`}
                      {...field}
                      options={StateCode}
                      getOptionLabel={(option) => option.name ?? 'error'}
                      getOptionValue={(option) => option.code}
                      openMenuOnFocus={false}
                      isDisabled={readOnly}
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
              name={`${handlerType}.${addressType}.state`}
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
              {...register(`${handlerType}.${addressType}.zip`)}
              className={addressErrors?.zip && 'is-invalid'}
            />
            <div className="invalid-feedback">{addressErrors?.zip?.message}</div>
          </HtForm.Group>
        </Col>
        <Col>
          <HtForm.Group className="mb-2">
            <HtForm.Label className="mb-0" htmlFor={`${handlerType}.${addressType}Country`}>
              Country
            </HtForm.Label>
            {readOnly ? (
              <p className="mt-2">{getValues(`${handlerType}.${addressType}.country.name`)}</p>
            ) : (
              <Controller
                control={control}
                name={`${handlerType}.${addressType}.country`}
                render={({ field }) => {
                  return (
                    <Select
                      id={`${handlerType}.${addressType}Country`}
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
              name={`${handlerType}.${addressType}.country`}
              render={({ message }) => <span className="text-danger">{message}</span>}
            />
          </HtForm.Group>
        </Col>
      </Row>
    </>
  );
}
