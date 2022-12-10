import { Col, Form, Row } from 'react-bootstrap';
import StateSelect from './StateSelect';
import { useFormContext } from 'react-hook-form';
import { AddressType, HandlerType } from 'types/Handler/Handler';
import { ErrorMessage } from '@hookform/error-message';

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
            <Form.Label className="mb-0">State</Form.Label>
            <Form.Select
              placeholder="Select State"
              {...register(`${namePrefix}.state`)}
            >
              <StateSelect />
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">Zip</Form.Label>
            <Form.Control
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
