import AddButton from 'components/AddButton';
import HandlerDetails from 'components/HandlerDetails';
import HtCard from 'components/HtCard';
import AdditionalInfoForm from 'components/ManifestForm/AdditionalInfo';
import ContactForm from 'components/ManifestForm/ContactForm';
import { AddTransporter, TransporterTable } from 'components/ManifestForm/Transporter';
import { WasteLineTable } from 'components/ManifestForm/WasteLine/WasteLineTable/WasteLineTable';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Handler, Manifest } from 'types';
import { HandlerType } from 'types/Handler/Handler';
import { WasteLine } from 'types/WasteLine';
import HandlerForm from './HandlerForm';
import AddTsdf from './Tsdf';
import AddWasteLine from './WasteLine';

/**
 * Returns a form for, currently only, new uniform hazardous waste manifest.
 * @constructor
 */
// ToDo: accept an existing manifest (Manifest type) and set as default value
function ManifestForm() {
  // Top level ManifestForm methods and objects
  const manifestMethods = useForm<Manifest>();
  const onSubmit: SubmitHandler<Manifest> = (data: Manifest) => {
    // ToDo: on submit, validate the user input and send to back end for processing.
    console.log('manifest onSubmit: ', data);
  };

  useEffect(() => manifestMethods.setFocus('generator.epaSiteId'), []);

  // Transporter controls
  const [transFormShow, setTransFormShow] = useState<boolean>(false);
  const toggleTranSearchShow = () => setTransFormShow(!transFormShow);
  const transporters: Array<Handler> = manifestMethods.getValues('transporters');
  const tranArrayMethods = useFieldArray<Manifest, 'transporters'>({
    control: manifestMethods.control,
    name: 'transporters',
  });

  // WasteLine controls
  const [wlFormShow, setWlFormShow] = useState<boolean>(false);
  const toggleWlFormShow = () => setWlFormShow(!wlFormShow);
  const wastes: Array<WasteLine> = manifestMethods.getValues('wastes');
  const wasteArrayMethods = useFieldArray<Manifest, 'wastes'>({
    control: manifestMethods.control,
    name: 'wastes',
  });

  // Tsdf controls
  const [tsdfFormShow, setTsdfFormShow] = useState<boolean>(false);
  const toggleTsdfFormShow = () => setTsdfFormShow(!tsdfFormShow);
  const tsdf: Handler = manifestMethods.getValues('designatedFacility');

  return (
    <>
      <FormProvider {...manifestMethods}>
        <Form onSubmit={manifestMethods.handleSubmit(onSubmit)}>
          <h2 className="fw-bold">{'Draft Manifest'}</h2>
          <HtCard id="general-form-card">
            <HtCard.Header title="General info" />
            <HtCard.Body>
              <Row>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label htmlFor="manifestTrackingNumber" className="mb-0">
                      MTN
                    </Form.Label>
                    <Form.Control
                      id="manifestTrackingNumber"
                      disabled
                      type="text"
                      placeholder={'Draft Manifest'}
                      {...manifestMethods.register('manifestTrackingNumber')}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label htmlFor="status" className="mb-0">
                      Status
                    </Form.Label>
                    <Form.Select
                      id="status"
                      aria-label="manifestStatus"
                      {...manifestMethods.register('status')}
                    >
                      <option value="NotAssigned">Draft</option>
                      <option value="Pending">Pending</option>
                      <option value="Scheduled">Scheduled</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label htmlFor="submissionType" className="mb-0">
                      Manifest Type
                    </Form.Label>
                    <Form.Select
                      id="submissionType"
                      aria-label="submissionType"
                      {...manifestMethods.register('submissionType')}
                    >
                      <option value="FullElectronic">Electronic</option>
                      <option value="Hybrid">Hybrid</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label htmlFor="createdDate" className="mb-0">
                      Created Date
                    </Form.Label>
                    <Form.Control
                      id="createdDate"
                      disabled
                      type="date"
                      {...manifestMethods.register('createdDate')}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label htmlFor="updatedDate" className="mb-0">
                      Last Update Date
                    </Form.Label>
                    <Form.Control
                      id="updatedDate"
                      disabled
                      type="date"
                      {...manifestMethods.register('updatedDate')}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label htmlFor="shippedDate" className="mb-0">
                      Shipped Date
                    </Form.Label>
                    <Form.Control
                      id="shippedDate"
                      disabled
                      type="date"
                      {...manifestMethods.register('shippedDate')}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Check
                    type="checkbox"
                    id="import"
                    label="Imported Waste"
                    {...manifestMethods.register('import')}
                  />
                  <Form.Check
                    type="checkbox"
                    id="rejection"
                    label="Rejected Waste"
                    {...manifestMethods.register('rejection')}
                  />
                </Col>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label htmlFor="potentialShipDate" className="mb-0">
                      Potential Shipped Date
                    </Form.Label>
                    <Form.Control
                      id="potentialShipDate"
                      type="date"
                      {...manifestMethods.register('potentialShipDate')}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </HtCard.Body>
          </HtCard>
          <HtCard id="generator-form-card">
            <HtCard.Header title="Generator" />
            <HtCard.Body>
              <HandlerForm handlerType={HandlerType.Generator} />
              <ContactForm />
            </HtCard.Body>
          </HtCard>
          <HtCard id="transporter-form-card">
            <HtCard.Header title="Transporters" />
            <HtCard.Body className="pb-4">
              {/* List transporters */}
              <TransporterTable
                transporters={transporters}
                arrayFieldMethods={tranArrayMethods}
              />
              <AddButton onClick={toggleTranSearchShow} children={'Add Transporter'} />
            </HtCard.Body>
          </HtCard>
          <HtCard id="waste-form-card">
            <HtCard.Header title="Waste" />
            <HtCard.Body className="pb-4">
              {/* Table Showing current Waste Lines included on the manifest */}
              <WasteLineTable wastes={wastes} />
              <AddButton onClick={toggleWlFormShow} children={'Add Waste'} />
            </HtCard.Body>
          </HtCard>
          {/* Where The Tsdf information is added and displayed */}
          <HtCard id="tsdf-form-card">
            <HtCard.Header title="Designated Facility" />
            <HtCard.Body className="pb-4">
              {tsdf ? <HandlerDetails handler={tsdf} /> : <></>}
              <AddButton onClick={toggleTsdfFormShow} children={'Add TSDF'} />
            </HtCard.Body>
          </HtCard>
          <HtCard id="manifest-additional-info-card">
            {/* Additional information for the manifest, such as reference information*/}
            <HtCard.Header title={'Additional info'} />
            <HtCard.Body className="px-3">
              <AdditionalInfoForm />
            </HtCard.Body>
          </HtCard>
          <div className="mx-1 d-flex flex-row-reverse">
            <Button variant="success" type="submit">
              Create Manifest
            </Button>
          </div>
        </Form>
        <AddTransporter
          handleClose={toggleTranSearchShow}
          show={transFormShow}
          currentTransporters={transporters}
          appendTransporter={tranArrayMethods.append}
        />
        <AddWasteLine
          appendWaste={wasteArrayMethods.append}
          currentWastes={wastes}
          handleClose={toggleWlFormShow}
          show={wlFormShow}
        />
        <AddTsdf handleClose={toggleTsdfFormShow} show={tsdfFormShow} />
      </FormProvider>
    </>
  );
}

export default ManifestForm;
