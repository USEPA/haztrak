import { ErrorMessage } from '@hookform/error-message';
import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';
import { AddressType, HandlerType } from 'types/Handler/Handler';
import { CountryCode, StateCode } from './StateSelect';

interface Props {
  addressType: AddressType;
  handlerType: HandlerType;
  readOnly?: boolean;
}

/**
 * AddressForm can be used to set a Handler's mailingAddress or siteAddress
 * Needs to be used in the context of a FormProvider
 */
export function AddressForm({ addressType, handlerType, readOnly }: Props) {
  const namePrefix = `${handlerType}.${addressType}`;
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <Row className="mb-2">
        <Col>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0" htmlFor="addressStreetNumber">
              Street Number
            </Form.Label>
            <Form.Control
              id="addressStreetNumber"
              type="text"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder="1234"
              {...register(`${namePrefix}.streetNumber`)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0" htmlFor="addressStreetName">
              Street Name
            </Form.Label>
            <Form.Control
              id="addressStreetName"
              type="text"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder="Main St."
              {...register(`${namePrefix}.address1`)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0" htmlFor="addressCity">
              City
            </Form.Label>
            <Form.Control
              id="addressCity"
              type="text"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder="Springfield"
              {...register(`${namePrefix}.city`)}
            />
          </Form.Group>
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
          <Form.Group className="mb-2">
            <Form.Label className="mb-0" htmlFor={`${namePrefix}State`}>
              State
            </Form.Label>
            <Controller
              control={control}
              name={`${namePrefix}.state`}
              render={({ field, fieldState, formState }) => {
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
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0" htmlFor="addressZip">
              Zip
            </Form.Label>
            <Form.Control
              id="addressZip"
              type="text"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder="12345"
              {...register(`${namePrefix}.zip`)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0" htmlFor={`${namePrefix}Country`}>
              Country
            </Form.Label>
            <Controller
              control={control}
              name={`${namePrefix}.country`}
              render={({ field, fieldState, formState }) => {
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
          </Form.Group>
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
