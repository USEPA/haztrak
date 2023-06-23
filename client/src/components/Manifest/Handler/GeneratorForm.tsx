import { HtForm } from 'components/Ht';
import { AddressForm } from 'components/Manifest/Address';
import { ReactElement, useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { Manifest } from 'components/Manifest';

interface GeneratorFormProps {
  readOnly?: boolean;
}

/**
 * A form for the generator section of a manifest.
 * Currently, we only support using for the generator since it's the only handler type that
 * can be manually entered for an electronic/hybrid manifest.
 * @param readOnly
 * @constructor
 */
export function GeneratorForm({ readOnly }: GeneratorFormProps): ReactElement {
  const [mailCheck, setMailCheck] = useState(false);
  const {
    register,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<Manifest>();

  // If
  useEffect(() => {
    const siteAddress = getValues(`generator.siteAddress`);
    if (!mailCheck) {
      setValue(`generator.mailingAddress`, siteAddress);
    }
  }, [
    mailCheck,
    watch(`generator.siteAddress.streetNumber`),
    watch(`generator.siteAddress.address1`),
    watch(`generator.siteAddress.country`),
    watch(`generator.siteAddress.city`),
    watch(`generator.siteAddress.state`),
  ]);

  // Destructure the handler errors depending on whether this is form for
  const handlerErrors = errors.generator;

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
              placeholder={`generator Name`}
              {...register(`generator.name`)}
              className={handlerErrors?.name && 'is-invalid'}
            />
            <div className="invalid-feedback">{handlerErrors?.name?.message}</div>
          </HtForm.Group>
        </Col>
      </Row>
      <AddressForm addressType={'siteAddress'} readOnly={readOnly} />
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
            <AddressForm addressType={'mailingAddress'} readOnly={readOnly} />
          </>
        ) : (
          <></>
        )}
      </Row>
    </>
  );
}
