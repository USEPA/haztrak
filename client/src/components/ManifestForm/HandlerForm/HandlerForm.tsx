import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Handler } from 'types';
import StateSelect from './StateSelect';
import HandlerSchema from './HandlerValidation';
import { HandlerType } from 'types/Handler/Handler';

interface Props {
  handlerType: HandlerType;
}

function HandlerForm(props: Props): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Handler>({ resolver: yupResolver(HandlerSchema) });

  const onSubmit: SubmitHandler<Handler> = (data: Handler) => console.log(data);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row className="mb-2">
        <Col className="col-sm-4">
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">Generator ID</Form.Label>
            <Form.Control
              type="text"
              placeholder={'EPA ID number'}
              {...register('epaSiteId')}
            />
          </Form.Group>
        </Col>
        <Col className="col-sm-8">
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">Site Name</Form.Label>
            <Form.Control
              type="text"
              placeholder={`${props.handlerType} Name`}
              // register comes from react-hook-form, however haztrak leaves the
              // validation to the dedicated 'yup' library which is more expressive
              {...register('name')}
            />
          </Form.Group>
        </Col>
        {errors && (
          <span className="text-danger">{errors.epaSiteId?.message}</span>
        )}
        {errors && <span className="text-danger">{errors.name?.message}</span>}
      </Row>
      <Row className="mb-2">
        <Col>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">Street Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="1234"
              {...register('siteAddress.streetNumber')}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">Street Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Main St."
              {...register('siteAddress.address1')}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Springfield"
              {...register('siteAddress.city')}
            />
          </Form.Group>
        </Col>
        {errors && (
          <span className="text-danger">{errors.siteAddress?.message}</span>
        )}
        {errors && (
          <span className="text-danger">
            {errors.siteAddress?.streetNumber?.message}
          </span>
        )}
        {errors && (
          <span className="text-danger">
            {errors.siteAddress?.address1?.message}
          </span>
        )}
        {errors && (
          <span className="text-danger">
            {errors.siteAddress?.city?.message}
          </span>
        )}
      </Row>
      <Row className="mb-2">
        <Col>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">State</Form.Label>
            <Form.Select
              placeholder="Select State"
              {...register('siteAddress.state')}
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
              {...register('siteAddress.zip')}
            />
          </Form.Group>
        </Col>
        {errors && (
          <span className="text-danger">
            {errors.siteAddress?.zip?.message}
          </span>
        )}
        {errors && (
          <span className="text-danger">
            {errors.siteAddress?.state?.message}
          </span>
        )}
      </Row>
      <Button type="submit">Submit</Button>
      <Container></Container>
    </Form>
  );
}

export default HandlerForm;
