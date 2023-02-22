import { ErrorMessage } from '@hookform/error-message';
import { HtForm } from 'components/Ht';
import { AddressForm } from 'components/ManifestForm/AddressForm';
import { ReactElement, useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { Manifest } from 'types';
import { AddressType, HandlerType } from 'types/Handler/Handler';

interface HandlerFormProps {
  handlerType: HandlerType;
  readOnly?: boolean;
}

function HandlerForm({ handlerType, readOnly }: HandlerFormProps): ReactElement {
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

  // Watch for When the user sets the site address copy to mailing address
  // unless that is also supplied
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
          <HtForm.Group>
            <HtForm.Label htmlFor="handlerEPAId">Generator ID</HtForm.Label>
            <HtForm.Control
              id="handlerEPAId"
              type="text"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder={'EPA ID number'}
              {...register(`generator.epaSiteId`)}
            />
          </HtForm.Group>
        </Col>
        <Col className="col-sm-8">
          <HtForm.Group>
            <HtForm.Label htmlFor="handlerName">Site Name</HtForm.Label>
            <HtForm.Control
              id="handlerName"
              plaintext={readOnly}
              readOnly={readOnly}
              type="text"
              placeholder={`${handlerType} Name`}
              // register comes from react-hook-form, however haztrak leaves the
              // validation to the dedicated 'yup' library which is more expressive
              {...register(`generator.name`)}
            />
          </HtForm.Group>
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
      <AddressForm addressType={AddressType.site} handlerType={handlerType} readOnly={readOnly} />
      <Row className="mb-2">
        <Col>
          <HtForm.Check
            defaultChecked={mailCheck}
            onChange={(e) => {
              setMailCheck(e.target.checked);
            }}
            name="mailCheck"
            type="checkbox"
            disabled={readOnly}
            label="Separate Mailing address?"
            id="addressEqual"
          />
        </Col>
        {mailCheck ? (
          <>
            <h4>Mailing Address</h4>
            <AddressForm
              addressType={AddressType.mail}
              handlerType={handlerType}
              readOnly={readOnly}
            />
          </>
        ) : (
          <></>
        )}
      </Row>
    </>
  );
}

export default HandlerForm;
