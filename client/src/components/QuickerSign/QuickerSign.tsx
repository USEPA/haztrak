import { faFileSignature } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HtForm } from 'components/Ht';
import React from 'react';
import { Button, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ManifestHandler } from 'types/handler';
import { QuickerSignature } from 'types/manifest/signatures';
import { useNavigate } from 'react-router-dom';

interface QuickerSignProps {
  mtn: Array<string>;
  mtnHandler: ManifestHandler;
  handleClose?: () => void;
}

function QuickerSign({ mtn, mtnHandler, handleClose }: QuickerSignProps) {
  const { register, handleSubmit } = useForm<QuickerSignature>();
  const navigate = useNavigate();
  if (!handleClose) {
    // If handleClose function is not passed, assume navigate back 1
    handleClose = () => navigate(-1);
  }

  const onSubmit: SubmitHandler<QuickerSignature> = (data) => {
    console.log(data);
  };

  return (
    <>
      <HtForm onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col>
            <HtForm.Group>
              <HtForm.Label>Printed Name</HtForm.Label>
              <HtForm.Control
                id="printedSignatureName"
                type="text"
                placeholder="John Doe"
                {...register(`printedSignatureName`)}
              />
            </HtForm.Group>
          </Col>
          <Col>
            <HtForm.Group>
              <HtForm.Label>Signature Date</HtForm.Label>
              <HtForm.Control
                id="printedSignatureDate"
                type="datetime-local"
                {...register(`printedSignatureDate`)}
              />
            </HtForm.Group>
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

export default QuickerSign;
