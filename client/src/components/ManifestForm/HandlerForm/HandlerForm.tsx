import { Col, Form, Row } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { AddressType, HandlerType } from 'types/Handler/Handler';
import { ReactElement, useEffect, useState } from 'react';
import { AddressForm } from '../AddressForm';
import { ErrorMessage } from '@hookform/error-message';

interface Props {
  handlerType: HandlerType;
}

function HandlerForm({ handlerType }: Props): ReactElement {
  const [mailCheck, setMailCheck] = useState(false);
  const {
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();
  useEffect(() => {
    if (!mailCheck) {
      const test = getValues('siteAddress');
      setValue('mailingAddress', test);
    }
  }, [mailCheck]);

  return (
    <>
      <Row className="mb-2">
        <Col className="col-sm-4">
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">Generator ID</Form.Label>
            <Form.Control
              type="text"
              placeholder={'EPA ID number'}
              {...register(`${handlerType}.epaSiteId`)}
            />
          </Form.Group>
        </Col>
        <Col className="col-sm-8">
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">Site Name</Form.Label>
            <Form.Control
              type="text"
              placeholder={`${handlerType} Name`}
              // register comes from react-hook-form, however haztrak leaves the
              // validation to the dedicated 'yup' library which is more expressive
              {...register(`${handlerType}.name`)}
            />
          </Form.Group>
        </Col>
        <ErrorMessage
          errors={errors}
          name={`epaSiteId`}
          render={({ message }) => (
            <span className="text-danger">{message}</span>
          )}
        />
        <ErrorMessage
          errors={errors}
          name={`name`}
          render={({ message }) => (
            <span className="text-danger">{message}</span>
          )}
        />
      </Row>
      <AddressForm addressType={AddressType.site} handlerType={handlerType} />
      <Row className="mb-2">
        {handlerType === HandlerType.Generator ? (
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
            <AddressForm
              addressType={AddressType.mail}
              handlerType={handlerType}
            />
          </>
        ) : (
          <></>
        )}
      </Row>
      {/*<Button type="submit">{`Add ${handlerType}`}</Button>*/}
    </>
  );
}

export default HandlerForm;
