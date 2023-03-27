import { AxiosError, AxiosResponse } from 'axios';
import { HtButton, HtCard, HtForm } from 'components/Ht';
import HandlerDetails from 'components/HandlerDetails';
import HtP from 'components/Ht/HtP';
import AdditionalInfoForm from 'components/ManifestForm/AdditionalInfo';
import ContactForm from 'components/ManifestForm/ContactForm';
import { AddTransporter, TransporterTable } from 'components/ManifestForm/Transporter';
import { WasteLineTable } from 'components/ManifestForm/WasteLine/WasteLineTable/WasteLineTable';
import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import htApi from 'services';
import { addMsg, useAppDispatch } from 'store';
import { Manifest } from 'types/manifest';
import { HandlerType, ManifestHandler, Transporter } from 'types/handler';
import { WasteLine } from 'types/wasteLine';
import HandlerForm from './HandlerForm';
import AddTsdf from './Tsdf';
import AddWasteLine from './WasteLine';
import { QuickerSignModal } from 'components/QuickerSign';

interface ManifestFormProps {
  readOnly?: boolean;
  manifestData?: Manifest;
  siteId?: string;
  mtn?: string;
}

interface QuickerSignData {
  handler: ManifestHandler | undefined;
  siteType: 'Generator' | 'Transporter' | 'Tsdf';
}

/**
 * Returns form for the uniform hazardous waste manifest. It also acts
 * as the current method of viewing manifest when the form is read only.
 * @constructor
 */
function ManifestForm({ readOnly, manifestData, siteId, mtn }: ManifestFormProps) {
  // Top level ManifestForm methods and objects
  const manifestMethods = useForm<Manifest>({ values: manifestData });
  // On load, focus the generator EPA ID.
  useEffect(() => manifestMethods.setFocus('generator.epaSiteId'), []);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<Manifest> = (data: Manifest) => {
    // ToDo: on submit, add front end validation
    htApi
      .post('/trak/manifest/', data)
      .then((response: AxiosResponse) => {
        dispatch(
          addMsg({
            uniqueId: Date.now(),
            createdDate: new Date().toISOString(),
            message: `${response.data.manifestTrackingNumber} ${response.statusText}`,
            alertType: 'Info',
            read: false,
            timeout: 5000,
          })
        );
      })
      .catch((error: AxiosError) => {
        dispatch(
          addMsg({
            uniqueId: Date.now(),
            createdDate: new Date().toISOString(),
            message: `${error.message}`,
            alertType: 'Error',
            read: false,
            timeout: 5000,
          })
        );
      });
  };
  // Generator controls
  const generator: ManifestHandler = manifestMethods.getValues('generator');

  // Transporter controls
  const [transFormShow, setTransFormShow] = useState<boolean>(false);
  const toggleTranSearchShow = () => setTransFormShow(!transFormShow);
  const transporters: Array<Transporter> = manifestMethods.getValues('transporters');
  const tranArrayMethods = useFieldArray<Manifest, 'transporters'>({
    control: manifestMethods.control,
    name: 'transporters',
  });
  // Quicker Sign controls
  const [quickerSignShow, setQuickerSignShow] = useState<boolean>(false);
  const [quickerSignHandler, setQuickerSignHandler] = useState<QuickerSignData>({
    handler: undefined,
    siteType: 'Generator',
  });
  /**
   * Convenience function to toggle Quicker Sign form
   */
  const toggleQuickerSignShow = () => setQuickerSignShow(!quickerSignShow);
  /**
   * Closure for controlling which ManifestHandler will be quicker signing
   * and toggle to modal that displays our Quicker Sign form.
   */
  const setupQuickerSign = (handlerData: QuickerSignData) => {
    setQuickerSignHandler(handlerData);
    toggleQuickerSignShow();
  };

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
  const tsdf: ManifestHandler = manifestMethods.getValues('designatedFacility');

  return (
    <>
      <FormProvider {...manifestMethods}>
        <HtForm onSubmit={manifestMethods.handleSubmit(onSubmit)}>
          <div className="d-flex justify-content-between">
            <h2 className="fw-bold">{`${
              manifestData?.manifestTrackingNumber || 'Draft'
            } Manifest`}</h2>
          </div>
          <HtCard id="general-form-card">
            <HtCard.Header title="General info" />
            <HtCard.Body>
              <Row>
                <Col>
                  <HtForm.Group>
                    <HtForm.Label htmlFor="manifestTrackingNumber">MTN</HtForm.Label>
                    <HtForm.Control
                      id="manifestTrackingNumber"
                      plaintext={readOnly}
                      readOnly={readOnly}
                      type="text"
                      placeholder={'Draft Manifest'}
                      {...manifestMethods.register('manifestTrackingNumber')}
                    />
                  </HtForm.Group>
                </Col>
                <Col>
                  <HtForm.Group>
                    <HtForm.Label htmlFor="status" className="mb-0">
                      Status
                    </HtForm.Label>
                    {readOnly ? (
                      <HtP>{manifestData?.status}</HtP>
                    ) : (
                      <HtForm.Select
                        id="status"
                        disabled={readOnly}
                        aria-label="manifestStatus"
                        {...manifestMethods.register('status')}
                      >
                        <option value="NotAssigned">Draft</option>
                        <option value="Pending">Pending</option>
                        <option value="Scheduled">Scheduled</option>
                      </HtForm.Select>
                    )}
                  </HtForm.Group>
                </Col>
                <Col>
                  <HtForm.Group>
                    <HtForm.Label htmlFor="submissionType" className="mb-0">
                      Manifest Type
                    </HtForm.Label>
                    {readOnly ? (
                      <HtP>{manifestData?.submissionType}</HtP>
                    ) : (
                      <HtForm.Select
                        id="submissionType"
                        disabled={readOnly}
                        aria-label="submissionType"
                        {...manifestMethods.register('submissionType')}
                      >
                        <option value="FullElectronic">Electronic</option>
                        <option value="Hybrid">Hybrid</option>
                      </HtForm.Select>
                    )}
                  </HtForm.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <HtForm.Group>
                    <HtForm.Label htmlFor="createdDate">Created Date</HtForm.Label>
                    <HtForm.Control
                      id="createdDate"
                      disabled
                      type="date"
                      {...manifestMethods.register('createdDate')}
                    />
                  </HtForm.Group>
                </Col>
                <Col>
                  <HtForm.Group>
                    <HtForm.Label htmlFor="updatedDate">Last Update Date</HtForm.Label>
                    <HtForm.Control
                      id="updatedDate"
                      disabled={readOnly}
                      type="date"
                      {...manifestMethods.register('updatedDate')}
                    />
                  </HtForm.Group>
                </Col>
                <Col>
                  <HtForm.Group>
                    <HtForm.Label htmlFor="shippedDate">Shipped Date</HtForm.Label>
                    <HtForm.Control
                      id="shippedDate"
                      disabled={readOnly}
                      type="date"
                      {...manifestMethods.register('shippedDate')}
                    />
                  </HtForm.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <HtForm.Check
                    type="checkbox"
                    id="import"
                    disabled={readOnly}
                    label="Imported Waste"
                    {...manifestMethods.register('import')}
                  />
                  <HtForm.Check
                    type="checkbox"
                    id="rejection"
                    disabled={readOnly}
                    label="Rejected Waste"
                    {...manifestMethods.register('rejection')}
                  />
                </Col>
                <Col>
                  <HtForm.Group>
                    <HtForm.Label htmlFor="potentialShipDate">Potential Shipped Date</HtForm.Label>
                    <HtForm.Control
                      id="potentialShipDate"
                      disabled={readOnly}
                      type="date"
                      {...manifestMethods.register('potentialShipDate')}
                    />
                  </HtForm.Group>
                </Col>
              </Row>
            </HtCard.Body>
          </HtCard>
          <HtCard id="generator-form-card">
            <HtCard.Header title="Generator" />
            <HtCard.Body>
              {readOnly ? (
                <>
                  <HandlerDetails handler={generator} />
                  <h4>Emergency Contact Information</h4>
                  <ContactForm handlerFormType="generator" readOnly={readOnly} />
                  <div className="d-flex justify-content-between">
                    {/* Button to bring up the Quicker Sign modal*/}
                    <HtButton
                      align="end"
                      onClick={() => {
                        setupQuickerSign({ handler: generator, siteType: 'Generator' });
                      }}
                      disabled={generator.signed}
                    >
                      Quicker Sign
                    </HtButton>
                  </div>
                </>
              ) : (
                <>
                  <HandlerForm handlerType={HandlerType.Generator} readOnly={readOnly} />
                  <h4>Emergency Contact Information</h4>
                  <ContactForm handlerFormType="generator" readOnly={readOnly} />
                </>
              )}
            </HtCard.Body>
          </HtCard>
          <HtCard id="transporter-form-card">
            <HtCard.Header title="Transporters" />
            <HtCard.Body className="pb-4">
              {/* List transporters */}
              <TransporterTable
                transporters={transporters}
                arrayFieldMethods={tranArrayMethods}
                readOnly={readOnly}
              />
              {readOnly ? (
                <></>
              ) : (
                <HtButton
                  onClick={toggleTranSearchShow}
                  children={'Add Transporter'}
                  variant="success"
                />
              )}
            </HtCard.Body>
          </HtCard>
          <HtCard id="waste-form-card">
            <HtCard.Header title="Waste" />
            <HtCard.Body className="pb-4">
              {/* Table Showing current Waste Lines included on the manifest */}
              <WasteLineTable wastes={wastes} />
              {readOnly ? (
                <></>
              ) : (
                <HtButton onClick={toggleWlFormShow} children={'Add Waste'} variant="success" />
              )}
            </HtCard.Body>
          </HtCard>
          {/* Where The Tsdf information is added and displayed */}
          <HtCard id="tsdf-form-card">
            <HtCard.Header title="Designated Facility" />
            <HtCard.Body className="pb-4">
              {tsdf ? (
                <>
                  <HandlerDetails handler={tsdf} />
                  <div className="d-flex justify-content-between">
                    {/* Button to bring up the Quicker Sign modal*/}
                    <HtButton
                      align="end"
                      onClick={() => {
                        setupQuickerSign({ handler: tsdf, siteType: 'Tsdf' });
                      }}
                      disabled={tsdf.signed}
                    >
                      Quicker Sign
                    </HtButton>
                  </div>
                </>
              ) : (
                <></>
              )}
              {readOnly ? (
                <></>
              ) : (
                <HtButton onClick={toggleTsdfFormShow} children={'Add TSDF'} variant="success" />
              )}
            </HtCard.Body>
          </HtCard>
          <HtCard id="manifest-additional-info-card">
            {/* Additional information for the manifest, such as reference information*/}
            <HtCard.Header title={'Additional info'} />
            <HtCard.Body className="px-3">
              <AdditionalInfoForm readOnly={readOnly} />
            </HtCard.Body>
          </HtCard>
          <div className="mx-1 d-flex flex-row-reverse">
            <Button className="mx-2" variant="success" type="submit" disabled={readOnly}>
              Save
            </Button>
            <Button
              className="mx-2"
              variant="danger"
              disabled={readOnly}
              onClick={() => {
                manifestMethods.reset();
                if (!mtn) {
                  navigate(-1);
                } else {
                  navigate(`/site/${siteId}/manifest/${mtn}/view`);
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={!readOnly}
              onClick={() => navigate(`/site/${siteId}/manifest/${mtn}/edit`)}
            >
              Edit
            </Button>
          </div>
        </HtForm>
        <AddTransporter
          handleClose={toggleTranSearchShow}
          show={transFormShow}
          currentTransporters={transporters}
          appendTransporter={tranArrayMethods.append}
        />
        <QuickerSignModal
          handleClose={toggleQuickerSignShow}
          show={quickerSignShow}
          mtn={[mtn ? mtn : '']}
          mtnHandler={quickerSignHandler.handler}
          siteType={quickerSignHandler.siteType}
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
