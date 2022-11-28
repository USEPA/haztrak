import React from 'react';
import { Alert, Button, Col, Container, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

interface Props {
  httpError?: 404 | 500;
}

function HtError({ httpError }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  const errorMsg = location.state;
  console.log('this is the error', errorMsg);

  return (
    <Container fluid className="p-5">
      <Row className="py-4 d-flex justify-content-center">
        <Col className="col-lg-8 col-md-10">
          <Row className="d-flex justify-content-center text-center">
            {httpError ? (
              <h1 className="text-danger display-2 fw-bold">{`${httpError}`}</h1>
            ) : (
              <i className="text-danger h1 fas fa-bug"></i>
            )}
          </Row>
          <Row className="d-flex justify-content-center">
            <h4 className="d-flex justify-content-center">
              Something went wrong
            </h4>
          </Row>
          {errorMsg ? (
            <Row className="d-flex justify-content-center pt-4">
              <Alert key="danger" variant="danger">
                {`${errorMsg}`}
              </Alert>
            </Row>
          ) : (
            ''
          )}
        </Col>
      </Row>
      <Row>
        <div className="py-4 d-flex justify-content-end">
          <Button className="mx-2" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button className="mx-2" onClick={() => navigate('/')}>
            Go Home
          </Button>
        </div>
      </Row>
    </Container>
  );
}

export default HtError;
