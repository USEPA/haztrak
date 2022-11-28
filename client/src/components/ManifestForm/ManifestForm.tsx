import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import HtCard from 'components/HtCard';
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { Manifest } from 'types';
import HandlerForm from './HandlerForm';
import { HandlerType } from 'types/Handler/Handler';
import { yupResolver } from '@hookform/resolvers/yup';
import ManifestSchema from './ManifestSchema';
import {
  TransporterSearch,
  TransporterTable,
} from 'components/ManifestForm/Transporter';
import { Transporter } from 'types/Transporter/Transporter';
import WasteLine from './WasteLine';
import Tsdf from './Tsdf';

/**
 * Returns a form for, currently only, new uniform hazardous waste manifest.
 *
 * @constructor
 */
// ToDo: accept an existing manifest (Manifest type) and set as default value
function ManifestForm() {
  // Top level ManifestForm methods and objects
  const methods = useForm<Manifest>({ resolver: yupResolver(ManifestSchema) });
  const {
    control,
    formState: { errors },
  } = methods;
  const onSubmit: SubmitHandler<Manifest> = (data: Manifest) =>
    console.log(data);

  // Transporter controls
  const [transFormShow, setTransFormShow] = useState<boolean>(false);
  const toggleTranSearchShow = () => setTransFormShow(!transFormShow);
  const transporters: [Transporter] = methods.getValues('transporters');
  const { append, remove } = useFieldArray<Manifest, 'transporters'>({
    control,
    name: 'transporters',
  });

  // WasteLine controls
  const [wlFormShow, setWlFormShow] = useState<boolean>(false);
  const toggleWlFormShow = () => setWlFormShow(!wlFormShow);

  // Tsdf controls
  const [tsdfFormShow, setTsdfFormShow] = useState<boolean>(false);
  const toggleTsdfFormShow = () => setTsdfFormShow(!tsdfFormShow);

  return (
    <>
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
              <TransporterTable
                transporters={transporters}
                removeTransporter={remove}
              />
              <Row className="d-flex justify-content-center px-5">
                <Col className="text-center">
                  <Button variant="success" onClick={toggleTranSearchShow}>
                    Add Transporter
                  </Button>
                </Col>
              </Row>
            </HtCard.Body>
          </HtCard>
          <HtCard id="waste-form-card">
            <HtCard.Header title="Waste" />
            <HtCard.Body className="bg-light rounded py-4">
              <Row className="d-flex justify-content-center px-5">
                <Col className="text-center">
                  <Button variant="success" onClick={toggleWlFormShow}>
                    Add Waste
                  </Button>
                </Col>
              </Row>
            </HtCard.Body>
          </HtCard>
          <HtCard id="tsdf-form-card">
            {/* Where The Tsdf information is added and displayed */}
            <HtCard.Header title="Designated Facility" />
            <HtCard.Body className="bg-light rounded py-4">
              <Row className="d-flex justify-content-center px-5">
                <Col className="text-center">
                  <Button variant="success" onClick={toggleTsdfFormShow}>
                    Add TSDF
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
          currentTransporters={transporters}
          appendTransporter={append}
        />
        <WasteLine handleClose={toggleWlFormShow} show={wlFormShow} />
        <Tsdf handleClose={toggleTsdfFormShow} show={tsdfFormShow} />
      </FormProvider>
    </>
  );
}

export default ManifestForm;
