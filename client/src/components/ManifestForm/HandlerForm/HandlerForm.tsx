import { ErrorMessage } from '@hookform/error-message';
import { AddressForm } from 'components/ManifestForm/AddressForm';
import { ReactElement, useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { Manifest } from 'types';
import { AddressType, HandlerType } from 'types/Handler/Handler';

interface Props {
  handlerType: HandlerType;
}

function HandlerForm({ handlerType }: Props): ReactElement {
  const [mailCheck, setMailCheck] = useState(false);
  if (handlerType !== HandlerType.Generator) {
    throw new Error();
  }

  const {
    register,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<Manifest>();

  useEffect(() => {
    const siteAddress = getValues(`${handlerType}.siteAddress`);
    if (!mailCheck) {
      setValue(`${handlerType}.mailingAddress`, siteAddress);
    }
  }, [
    mailCheck,
    watch(`${handlerType}.siteAddress.streetNumber`),
    watch(`${handlerType}.siteAddress.address1`),
    watch(`${handlerType}.siteAddress.country`),
    watch(`${handlerType}.siteAddress.city`),
    watch(`${handlerType}.siteAddress.state`),
  ]);

  return (
    <>
      <Row className="mb-2">
        <Col className="col-sm-4">
          <Form.Group className="mb-2">
            <Form.Label className="mb-0" htmlFor="handlerEPAId">
              Generator ID
            </Form.Label>
            <Form.Control
              id="handlerEPAId"
              type="text"
              placeholder={'EPA ID number'}
              {...register(`generator.epaSiteId`)}
            />
          </Form.Group>
        </Col>
        <Col className="col-sm-8">
          <Form.Group className="mb-2">
            <Form.Label className="mb-0" htmlFor="handlerName">
              Site Name
            </Form.Label>
            <Form.Control
              id="handlerName"
              type="text"
              placeholder={`${handlerType} Name`}
              // register comes from react-hook-form, however haztrak leaves the
              // validation to the dedicated 'yup' library which is more expressive
              {...register(`generator.name`)}
            />
          </Form.Group>
        </Col>
        <ErrorMessage
          errors={errors}
          name={`epaSiteId`}
          render={({ message }) => <span className="text-danger">{message}</span>}
        />
        <ErrorMessage
          errors={errors}
          name={`name`}
          render={({ message }) => <span className="text-danger">{message}</span>}
        />
      </Row>
      <AddressForm addressType={AddressType.site} handlerType={handlerType} />
      <Row className="mb-2">
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
        {mailCheck ? (
          <>
            <h4>Mailing Address</h4>
            <AddressForm addressType={AddressType.mail} handlerType={handlerType} />
          </>
        ) : (
          <></>
        )}
      </Row>
    </>
  );
}

export default HandlerForm;
