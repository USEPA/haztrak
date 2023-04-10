import { ErrorMessage } from '@hookform/error-message';
import { HtForm } from 'components/Ht';
import HtP from 'components/Ht/HtP';
import { HandlerTypeEnum } from 'components/ManifestForm/manifestSchema';
import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';
import { z } from 'zod';
import { CountryCode, StateCode } from './StateSelect';

/**
 * indicates whether an address is the site's physical location or mailing location
 */
const addressType = z.enum(['siteAddress', 'mailingAddress']);

type AddressType = z.infer<typeof addressType>;

interface Props {
  addressType: AddressType;
  handlerType: HandlerTypeEnum;
  readOnly?: boolean;
}

/**
 * AddressForm can be used to set a Handler's mailingAddress or siteAddress
 * Needs to be used in the context of a FormProvider
 */
export function AddressForm({ addressType, handlerType, readOnly }: Props) {
  const namePrefix = `${handlerType}.${addressType}`;
  const {
    getValues,
    control,
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <Row className="mb-2">
        <Col>
          <HtForm.Group>
            <HtForm.Label htmlFor="addressStreetNumber">Street Number</HtForm.Label>
            <Form.Control
              id="addressStreetNumber"
              type="text"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder="1234"
              {...register(`${namePrefix}.streetNumber`)}
            />
          </HtForm.Group>
        </Col>
        <Col>
          <HtForm.Group>
            <HtForm.Label htmlFor="addressStreetName">Street Name</HtForm.Label>
            <Form.Control
              id="addressStreetName"
              type="text"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder="Main St."
              {...register(`${namePrefix}.address1`)}
            />
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
              {...register(`${namePrefix}.city`)}
            />
          </HtForm.Group>
        </Col>
        <ErrorMessage
          errors={errors}
          name={`${namePrefix}.address1`}
          render={({ message }) => <span className="text-danger">{message}</span>}
        />
        <ErrorMessage
          errors={errors}
          name={`${namePrefix}.streetNumber`}
          render={({ message }) => <span className="text-danger">{message}</span>}
        />
        <ErrorMessage
          errors={errors}
          name={`${namePrefix}.city`}
          render={({ message }) => <span className="text-danger">{message}</span>}
        />
      </Row>
      <Row className="mb-2">
        <Col>
          <HtForm.Group className="mb-2">
            <HtForm.Label className="mb-0" htmlFor={`${namePrefix}State`}>
              State
            </HtForm.Label>
            {readOnly ? (
              <HtP>{getValues(`${namePrefix}.state.name`)}</HtP>
            ) : (
              <Controller
                control={control}
                name={`${namePrefix}.state`}
                render={({ field }) => {
                  return (
                    <Select
                      id={`${namePrefix}State`}
                      {...field}
                      options={StateCode}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.code}
                      openMenuOnFocus={false}
                      isDisabled={readOnly}
                    />
                  );
                }}
              />
            )}
          </HtForm.Group>
        </Col>
        <Col>
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
              {...register(`${namePrefix}.zip`)}
            />
          </HtForm.Group>
        </Col>
        <Col>
          <HtForm.Group className="mb-2">
            <HtForm.Label className="mb-0" htmlFor={`${namePrefix}Country`}>
              Country
            </HtForm.Label>
            {readOnly ? (
              <HtP>{getValues(`${namePrefix}.country.name`)}</HtP>
            ) : (
              <Controller
                control={control}
                name={`${namePrefix}.country`}
                render={({ field }) => {
                  return (
                    <Select
                      id={`${namePrefix}Country`}
                      {...field}
                      defaultValue={CountryCode[0]}
                      options={CountryCode}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.code}
                      openMenuOnFocus={false}
                      isDisabled={readOnly}
                    />
                  );
                }}
              />
            )}
          </HtForm.Group>
        </Col>
        <ErrorMessage
          errors={errors}
          name={`${namePrefix}.zip`}
          render={({ message }) => <span className="text-danger">{message}</span>}
        />
        <ErrorMessage
          errors={errors}
          name={`${namePrefix}.state`}
          render={({ message }) => <span className="text-danger">{message}</span>}
        />
      </Row>
    </>
  );
}
