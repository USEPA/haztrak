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

  if (errors) {
    console.log(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col className="col-sm-4">
          <Form.Group className="mb-2">
            <Form.Label>Generator ID</Form.Label>
            <Form.Control
              type="text"
              placeholder={'EPA ID number'}
              {...register('epaSiteId', { required: true })}
            />
          </Form.Group>
        </Col>
        <Col className="col-sm-8">
          <Form.Group className="mb-2">
            <Form.Label>Site Name</Form.Label>
            <Form.Control
              type="text"
              placeholder={`${props.handlerType} Name`}
              {...register('name', { required: true })}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-2">
            <Form.Label>Street Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="1234"
              {...register('siteAddress.streetNumber')}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-2">
            <Form.Label>Street Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Main St."
              {...register('siteAddress.address1')}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-2">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Springfield"
              {...register('siteAddress.city')}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-2">
            <Form.Label>State</Form.Label>
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
            <Form.Label>Zip</Form.Label>
            <Form.Control
              type="text"
              placeholder="12345"
              {...register('siteAddress.zip')}
            />
          </Form.Group>
        </Col>
      </Row>
      <Button className="m-2" type="submit">
        Submit
      </Button>
      <Container>
        {errors && <span>{errors.epaSiteId?.message}</span>}
        {errors && <span>{errors.name?.message}</span>}
        {errors && <span>{errors.siteAddress?.message}</span>}
        {errors && <span>{errors.siteAddress?.streetNumber?.message}</span>}
        {errors && <span>{errors.siteAddress?.address1?.message}</span>}
        {errors && <span>{errors.siteAddress?.city?.message}</span>}
      </Container>
    </Form>
  );
}

export default HandlerForm;
