import React, { useState } from 'react';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import HtCard from 'components/HtCard';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { Handler, Manifest } from 'types';
import HandlerForm from '../HandlerForm';
import { HandlerType } from 'types/Handler/Handler';
import { yupResolver } from '@hookform/resolvers/yup';
import ManifestSchema from './ManifestSchema';
import TransporterSearch from '../TransporterSearch';
import { Transporter } from 'types/Transporter/Transporter';

function ManifestForm() {
  // methods contains all the useForm context
  const methods = useForm<Manifest>({ resolver: yupResolver(ManifestSchema) });

  const {
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<Manifest> = (data: Manifest) =>
    console.log(data);

  const [transFormShow, setTransFormShow] = useState(false);
  const toggleTranSearchShow = () => setTransFormShow(!transFormShow);

  const transporters: [Handler] = methods.getValues('transporters');
  console.log(transporters);

  return (
    <Container>
      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <h2 className="fw-bold">{'Draft Manifest'}</h2>
          <HtCard id="general-form-card">
            <HtCard.Header title="General info" />
            <HtCard.Body>
              <Form.Group className="mb-2">
                <Form.Label className="mb-0">MTN</Form.Label>
                <Form.Control
                  disabled
                  type="text"
                  placeholder={'Draft Manifest'}
                  {...methods.register('manifestTrackingNumber')}
                />
              </Form.Group>
            </HtCard.Body>
          </HtCard>
          <HtCard id="generator-form-card">
            <HtCard.Header title="Generator" />
            <HtCard.Body>
              <HandlerForm handlerType={HandlerType.Generator} />
            </HtCard.Body>
          </HtCard>
          <HtCard id="transporter-form-card">
            <HtCard.Header title="Transporters" />
            <HtCard.Body className="bg-light rounded py-4">
              {/* List transporters */}
              <Row>
                {transporters ? (
                  transporters.map((transporter, index) => {
                    return <p key={index}>{transporter.name}</p>;
                  })
                ) : (
                  <p>bye</p>
                )}
              </Row>
              <Row className="d-flex justify-content-center px-5">
                <Col className="text-center">
                  <Button variant="success" onClick={toggleTranSearchShow}>
                    Add Transporter
                  </Button>
                </Col>
              </Row>
            </HtCard.Body>
          </HtCard>
          <div className="mx-1 d-flex flex-row-reverse">
            <Button variant="success" type="submit">
              Create Manifest
            </Button>
          </div>
        </Form>
        <TransporterSearch
          handleClose={toggleTranSearchShow}
          show={transFormShow}
        />
      </FormProvider>
    </Container>
  );
}

export default ManifestForm;
