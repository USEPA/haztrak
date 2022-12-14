import { ErrorMessage } from '@hookform/error-message';
import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';
import { AddressType, HandlerType } from 'types/Handler/Handler';
import { StateCode } from './StateSelect';

interface Props {
  addressType: AddressType;
  handlerType: HandlerType;
}

/**
 * AddressForm can be used to set a Handler's mailingAddress or siteAddress
 * Needs to be used in the context of a FormProvider
 */
export function AddressForm({ addressType, handlerType }: Props) {
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
            <Form.Label className="mb-0" htmlFor="addressState">
              State
            </Form.Label>
            <Controller
              control={control}
              name={`${namePrefix}.state`}
              render={({ field, fieldState, formState }) => {
                return (
                  <Select
                    {...field}
                    options={StateCode}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.code}
                    openMenuOnFocus={false}
                  />
                );
              }}
            ></Controller>
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
              placeholder="12345"
              {...register(`${namePrefix}.zip`)}
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
