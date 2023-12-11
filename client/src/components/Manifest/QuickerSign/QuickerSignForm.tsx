import { faFileSignature, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Handler, RcraSiteType } from 'components/Manifest/manifestSchema';
import { Transporter } from 'components/Manifest/Transporter';
import { HtForm } from 'components/UI';
import { useProgressTracker } from 'hooks';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, ListGroup, Row, Stack } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  addTask,
  selectUserName,
  updateTask,
  useAppDispatch,
  useAppSelector,
  useSignElectronicManifestMutation,
} from 'store';
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
  const dispatch = useAppDispatch();
  const userName = useAppSelector(selectUserName);
  const [signManifest, { data, error: ApiError, isLoading }] = useSignElectronicManifestMutation();
  const [taskId, setTaskId] = useState<string | undefined>(undefined);
  const { inProgress, data: progressData } = useProgressTracker({ taskId: taskId });
  const { register, handleSubmit, setValue } = useForm<QuickerSignature>({
    defaultValues: {
      printedSignatureName: userName,
      printedSignatureDate: new Date().toISOString().slice(0, -8),
    },
  });
  const navigate = useNavigate();
  if (!handleClose) {
    handleClose = () => navigate(-1);
  }

  useEffect(() => {
    if (data?.taskId) {
      dispatch(
        addTask({
          taskId: data.taskId,
          status: 'PENDING',
          taskName: `Signing manifest ${mtn}`,
        })
      );
      setTaskId(data.taskId);
    }
  }, [data]);

  useEffect(() => {
    if (ApiError && taskId) {
      dispatch(
        updateTask({
          taskId: taskId,
          status: 'FAILURE',
        })
      );
    }
  }, [ApiError]);

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
    signManifest(signature);
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
                variant="outline-secondary"
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
          <Stack direction="horizontal" gap={2} className="d-flex justify-content-end">
            <Button variant="outline-danger" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="success" type="submit">
              <span>Submit Signature </span>
              <FontAwesomeIcon icon={faPen} />
            </Button>
          </Stack>
        </Container>
      </HtForm>
    </>
  );
}
