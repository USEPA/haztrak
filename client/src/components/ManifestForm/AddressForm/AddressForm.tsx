import { Col, Form, Row } from 'react-bootstrap';
import StateSelect from './StateSelect';
import { useFormContext } from 'react-hook-form';
import { AddressType } from '../../../types/Handler/Handler';
import { ErrorMessage } from '@hookform/error-message';

interface Props {
  addressType: AddressType;
}

function AddressForm({ addressType }: Props) {
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
              {...register(`${addressType}.streetNumber`)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">Street Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Main St."
              {...register(`${addressType}.address1`)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Springfield"
              {...register(`${addressType}.city`)}
            />
          </Form.Group>
        </Col>
        <ErrorMessage
          errors={errors}
          name={`${addressType}.address1`}
          render={({ message }) => (
            <span className="text-danger">{message}</span>
          )}
        />
        <ErrorMessage
          errors={errors}
          name={`${addressType}.streetNumber`}
          render={({ message }) => (
            <span className="text-danger">{message}</span>
          )}
        />
        <ErrorMessage
          errors={errors}
          name={`${addressType}.city`}
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
              {...register(`${addressType}.state`)}
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
              {...register(`${addressType}.zip`)}
            />
          </Form.Group>
        </Col>
        <ErrorMessage
          errors={errors}
          name={`${addressType}.zip`}
          render={({ message }) => (
            <span className="text-danger">{message}</span>
          )}
        />
        <ErrorMessage
          errors={errors}
          name={`${addressType}.state`}
          render={({ message }) => (
            <span className="text-danger">{message}</span>
          )}
        />
      </Row>
    </>
  );
}

export default AddressForm;
