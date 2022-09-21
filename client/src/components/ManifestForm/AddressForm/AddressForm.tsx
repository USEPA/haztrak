import { Col, Form, Row } from 'react-bootstrap';
import StateSelect from './StateSelect';
import { useFormContext } from 'react-hook-form';
import { AddressType, HandlerType } from 'types/Handler/Handler';
import { ErrorMessage } from '@hookform/error-message';

// AddressForm can be used to set a Handler's mailingAddress or siteAddress
interface Props {
  addressType: AddressType;
  handlerType: HandlerType;
}

export function AddressForm({ addressType, handlerType }: Props) {
  const namePrefix = `${handlerType}.${addressType}`;
  // AddressForm uses the react-hook-form useFormContext hook to avoid the need
  // to pass the useForm methods via props. it needs to be used in a FormProvider
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <Row className="mb-2">
        <Col>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">Street Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="1234"
              {...register(`${namePrefix}.streetNumber`)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">Street Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Main St."
              {...register(`${namePrefix}.address1`)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Springfield"
              {...register(`${namePrefix}.city`)}
            />
          </Form.Group>
        </Col>
        <ErrorMessage
          errors={errors}
          name={`${namePrefix}.address1`}
          render={({ message }) => (
            <span className="text-danger">{message}</span>
          )}
        />
        <ErrorMessage
          errors={errors}
          name={`${namePrefix}.streetNumber`}
          render={({ message }) => (
            <span className="text-danger">{message}</span>
          )}
        />
        <ErrorMessage
          errors={errors}
          name={`${namePrefix}.city`}
          render={({ message }) => (
            <span className="text-danger">{message}</span>
          )}
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
          render={({ message }) => (
            <span className="text-danger">{message}</span>
          )}
        />
        <ErrorMessage
          errors={errors}
          name={`${namePrefix}.state`}
          render={({ message }) => (
            <span className="text-danger">{message}</span>
          )}
        />
      </Row>
    </>
  );
}
