import { Button, Col, Form, Row } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Handler } from 'types';
import HandlerSchema from './HandlerSchema';
import { AddressType, HandlerType } from 'types/Handler/Handler';
import { useState } from 'react';
import { AddressForm } from '../AddressForm';

interface Props {
  handlerType: HandlerType;
}

function HandlerForm(props: Props): JSX.Element {
  const [mailCheck, setMailCheck] = useState(false);
  const methods = useForm<Handler>({ resolver: yupResolver(HandlerSchema) });
  const {
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<Handler> = (data: Handler) => {
    if (!mailCheck) {
      data.mailingAddress = data.siteAddress;
    }
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit(onSubmit)}>
        <Row className="mb-2">
          <Col className="col-sm-4">
            <Form.Group className="mb-2">
              <Form.Label className="mb-0">Generator ID</Form.Label>
              <Form.Control
                type="text"
                placeholder={'EPA ID number'}
                {...methods.register('epaSiteId')}
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
                {...methods.register('name')}
              />
            </Form.Group>
          </Col>
          {errors && (
            <span className="text-danger">{errors.epaSiteId?.message}</span>
          )}
          {errors && (
            <span className="text-danger">{errors.name?.message}</span>
          )}
        </Row>
        <AddressForm addressType={AddressType.site} />
        <Row className="mb-2">
          {props.handlerType === HandlerType.Generator ? (
            <Col>
              <Form.Check
                defaultChecked={mailCheck}
                onChange={(e) => {
                  setMailCheck(e.target.checked);
                }}
                name="mailCheck"
                type="checkbox"
                label="Separate Mailing address?"
                id="addressEqual"
              />
            </Col>
          ) : (
            <></>
          )}
          {mailCheck ? (
            <>
              <h4>Mailing Address</h4>
              <AddressForm addressType={AddressType.mail} />
            </>
          ) : (
            <></>
          )}
        </Row>
        <Button type="submit">{`Add ${props.handlerType}`}</Button>
      </Form>
    </FormProvider>
  );
}

export default HandlerForm;
