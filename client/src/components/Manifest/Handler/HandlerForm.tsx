import { HtForm } from 'components/Ht';
import { AddressForm } from 'components/Manifest/Address';
import { ReactElement, useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { Manifest } from 'types/manifest';

interface HandlerFormProps {
  handlerType: 'generator' | 'designatedFacility';
  readOnly?: boolean;
}

export function HandlerForm({ handlerType, readOnly }: HandlerFormProps): ReactElement {
  const [mailCheck, setMailCheck] = useState(false);
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

  // Destructure the handler errors depending on whether this is form for
  // manifest generator of designated facility for use in the form.
  let handlerErrors = errors.generator;
  if (handlerType === 'designatedFacility') {
    handlerErrors = errors.designatedFacility;
  }

  return (
    <>
      <Row className="mb-2">
        <Col className="col-sm-4">
          <HtForm.Group>
            <HtForm.Label htmlFor="handlerEPAId">Generator ID</HtForm.Label>
            <Form.Control
              id="handlerEPAId"
              type="text"
              plaintext={readOnly}
              readOnly={readOnly}
              placeholder={'EPA ID number'}
              {...register(`generator.epaSiteId`)}
              className={handlerErrors?.epaSiteId && 'is-invalid'}
            />
            <div className="invalid-feedback">{handlerErrors?.epaSiteId?.message}</div>
          </HtForm.Group>
        </Col>
        <Col className="col-sm-8">
          <HtForm.Group>
            <HtForm.Label htmlFor="handlerName">Site Name</HtForm.Label>
            <Form.Control
              id="handlerName"
              plaintext={readOnly}
              readOnly={readOnly}
              type="text"
              placeholder={`${handlerType} Name`}
              {...register(`generator.name`)}
              className={handlerErrors?.name && 'is-invalid'}
            />
            <div className="invalid-feedback">{handlerErrors?.name?.message}</div>
          </HtForm.Group>
        </Col>
      </Row>
      <AddressForm addressType={'siteAddress'} handlerType={handlerType} readOnly={readOnly} />
      <Row className="mb-2">
        <Col>
          {/* Check box that indicated whether the mailing address is different from the*/}
          {/* handler's address*/}
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
              addressType={'mailingAddress'}
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
