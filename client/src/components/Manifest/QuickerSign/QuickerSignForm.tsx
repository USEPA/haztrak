import { faFileSignature } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AxiosError } from 'axios';
import { Handler, RcraSiteType } from 'components/Manifest/manifestSchema';
import { Transporter } from 'components/Manifest/Transporter';
import { HtForm } from 'components/UI';
import React from 'react';
import { Button, Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { manifestApi } from 'services';
import { selectUserName, useAppSelector } from 'store';
import { z } from 'zod';

const siteType = z.enum(['Transporter', 'Generator', 'Tsdf', 'Broker']);
/**
 * The EPA Quicker Sign schema
 */
const quickerSignatureSchema = z.object({
  siteId: z.string(),
  siteType: siteType,
  transporterOrder: z.number().optional(),
  printedSignatureName: z.string(),
  printedSignatureDate: z.string(),
  manifestTrackingNumbers: z.string().array(),
});

const quickerSignDataSchema = z.object({
  handler: z.any(),
  siteType: z.enum(['Generator', 'Transporter', 'Tsdf']),
});

export type QuickerSignData = z.infer<typeof quickerSignDataSchema>;
export type QuickerSignature = z.infer<typeof quickerSignatureSchema>;

interface QuickerSignProps {
  mtn: Array<string>;
  mtnHandler: Handler | Transporter;
  siteType: RcraSiteType;
  handleClose?: () => void;
}

/**
 * Form used to collect signature information, following the RCRAInfo QuickerSignature schema,
 * which can sent to EPA's RCRAInfo to electronically sign manifests.
 * @param mtn
 * @param mtnHandler
 * @param handleClose
 * @param siteType
 * @constructor
 */
export function QuickerSignForm({ mtn, mtnHandler, handleClose, siteType }: QuickerSignProps) {
  const userName = useAppSelector(selectUserName);
  const { register, handleSubmit, setValue } = useForm<QuickerSignature>({
    defaultValues: {
      printedSignatureName: userName,
      printedSignatureDate: new Date().toISOString().slice(0, -8),
    },
  });
  const navigate = useNavigate();
  if (!handleClose) {
    // If handleClose function is not passed, assume navigate back 1
    handleClose = () => navigate(-1);
  }

  const onSubmit: SubmitHandler<QuickerSignature> = (data) => {
    let signature: QuickerSignature = {
      printedSignatureDate: data.printedSignatureDate + '.000Z',
      printedSignatureName: data.printedSignatureName,
      siteId: mtnHandler.epaSiteId,
      siteType: siteType,
      manifestTrackingNumbers: mtn,
    };
    if ('order' in mtnHandler) {
      signature = {
        ...signature,
        transporterOrder: mtnHandler.order,
      };
    }
    manifestApi
      .createQuickSignature(signature)
      .then((response) => {
        toast.success('Signing through e-Manifest');
      })
      .catch((error: AxiosError) => toast.error(error.message));
    if (handleClose) {
      handleClose();
    }
  };

  return (
    <>
      <HtForm onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col>
            <HtForm.Group>
              <HtForm.Label>Printed Name</HtForm.Label>
              <Form.Control
                id="printedSignatureName"
                type="text"
                placeholder="John Doe"
                {...register(`printedSignatureName`)}
              />
            </HtForm.Group>
          </Col>
          <Col>
            <HtForm.Label htmlFor={'printedSignatureDate'}>Signature Date</HtForm.Label>
            <HtForm.InputGroup>
              <Form.Control
                id="printedSignatureDate"
                type="datetime-local"
                {...register(`printedSignatureDate`)}
              />
              <Button
                onClick={() => {
                  setValue('printedSignatureDate', new Date().toISOString().slice(0, -8), {
                    shouldDirty: true,
                  });
                }}
              >
                Now
              </Button>
            </HtForm.InputGroup>
          </Col>
        </Row>
        <Container>
          <Row>
            <h5>
              <i>
                Sign as site <b className="text-info">{`${mtnHandler.epaSiteId}`}</b>
              </i>
            </h5>
            <ListGroup variant="flush">
              {mtn.map((value) => {
                return (
                  <ListGroup.Item key={value}>
                    <FontAwesomeIcon icon={faFileSignature} className="text-success" />
                    {` ${value}`}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Row>
          <div className="d-flex justify-content-end">
            <Button variant="danger" onClick={handleClose} className="mx-2">
              Cancel
            </Button>
            <Button variant="success" type="submit">
              Sign
            </Button>
          </div>
        </Container>
      </HtForm>
    </>
  );
}
