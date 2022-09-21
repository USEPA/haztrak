import {Button, Col, Form, Row} from 'react-bootstrap';
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {Handler} from 'types';
import HandlerSchema from './HandlerSchema';
import {AddressType, HandlerType} from 'types/Handler/Handler';
import {useEffect, useState} from 'react';
import {AddressForm} from '../AddressForm';
import {ErrorMessage} from '@hookform/error-message';

interface Props {
  handlerType: HandlerType;
}

function HandlerForm(props: Props): JSX.Element {
  const [mailCheck, setMailCheck] = useState(false);
  const {
    register,
    getValues,
    setValue,
    formState: {errors},
  } = useFormContext();
  useEffect(() => {
    if (!mailCheck) {
      const test = getValues('siteAddress');
      setValue('mailingAddress', test);
      console.log(getValues());
    } else {
      console.log('separate values filled');
    }
  }, [mailCheck]);
  // const methods = useForm<Handler>({ resolver: yupResolver(HandlerSchema) });
  // const {
  //   formState: { errors },
  // } = methods;

  const onSubmit: SubmitHandler<Handler> = (data: Handler) => {
    if (!mailCheck) {
      data.mailingAddress = data.siteAddress;
    }
    console.log(data);
  };

  return (
    <>
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
        <ErrorMessage
          errors={errors}
          name={`epaSiteId`}
          render={({message}) => (
            <span className="text-danger">{message}</span>
          )}
        />
        <ErrorMessage
          errors={errors}
          name={`name`}
          render={({message}) => (
            <span className="text-danger">{message}</span>
          )}
        />
      </Row>
      <AddressForm addressType={AddressType.site}/>
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
            <AddressForm addressType={AddressType.mail}/>
          </>
        ) : (
          <></>
        )}
      </Row>
      <Button type="submit">{`Add ${props.handlerType}`}</Button>
    </>
  );
}

export default HandlerForm;
