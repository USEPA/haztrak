import { zodResolver } from '@hookform/resolvers/zod';
import { HtButton, HtCard, HtForm, InfoIconTooltip } from 'components/Ht';
import { RcraSiteDetails } from 'components/RcraSite';
import { ContactForm } from './Contact';
import { AddTransporter, Transporter, TransporterTable } from './Transporter';
import { WasteLineTable, AddWasteLine } from './WasteLine';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { QuickerSignData } from './QuickerSign';
import { WasteLine } from 'components/Manifest/WasteLine/wasteLineSchema';
import { AddHandler, Handler, HandlerForm } from './Handler';
import { QuickerSignModal, QuickerSignModalBtn } from './QuickerSign';
import { manifestSchema, Manifest, HandlerType } from './manifestSchema';
import { AdditionalInfoForm } from 'components/AdditionalInfo/AdditionalInfoForm';

const defaultValues: Manifest = {
  transporters: [],
  wastes: [],
  status: 'NotAssigned',
  submissionType: 'FullElectronic',
};

interface ManifestFormProps {
  readOnly?: boolean;
  manifestData?: Manifest;
  siteId?: string;
  mtn?: string;
}

/**
 * Returns form for the uniform hazardous waste manifest. It also acts
 * as the current method of viewing manifest when the form is read only.
 * @constructor
 */
export function ManifestForm({
  readOnly,
  manifestData = defaultValues,
  siteId,
  mtn,
}: ManifestFormProps) {
  // Top level ManifestForm methods and objects
  const manifestMethods = useForm<Manifest>({
    values: manifestData,
    resolver: zodResolver(manifestSchema),
  });
  const {
    formState: { errors },
  } = manifestMethods;
  const [manifestStatus, setManifestStatus] = useState(manifestData?.status);
  const isDraft = !manifestData?.manifestTrackingNumber;
  // On load, focus the generator EPA ID.
  useEffect(() => manifestMethods.setFocus('generator.epaSiteId'), []);
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<Manifest> = (data: Manifest) => {
    console.log('Manifest Submitted', data);
  };

  // Generator controls
  const generator: Handler | undefined = manifestMethods.getValues('generator');

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
    siteType: 'Generator', // ToDo initialize to undefined
  });
  const toggleQuickerSignShow = () => setQuickerSignShow(!quickerSignShow);
  // function used to control the QuickerSign form (modal) and pass the necessary context
  const setupSign = (signContext: QuickerSignData) => {
    setQuickerSignHandler(signContext); // set state to appropriate Handler
    toggleQuickerSignShow(); // Toggle the Quicker Sign modal
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
  const tsdf: Handler | undefined = manifestMethods.getValues('designatedFacility');

  const signAble =
    manifestStatus === 'Scheduled' ||
    manifestStatus === 'InTransit' ||
    manifestStatus === 'ReadyForSignature';

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
                    <Form.Control
                      id="manifestTrackingNumber"
                      plaintext
                      readOnly
                      type="text"
                      placeholder={
                        isDraft ? 'Draft Manifest' : manifestData?.manifestTrackingNumber
                      }
                      {...manifestMethods.register('manifestTrackingNumber')}
                      className={errors.manifestTrackingNumber && 'is-invalid'}
                    />
                    <div className="invalid-feedback">{errors.manifestTrackingNumber?.message}</div>
                  </HtForm.Group>
                </Col>
                <Col>
                  <HtForm.Group>
                    <HtForm.Label htmlFor="status" className="mb-0">
                      {'Status '}
                      {readOnly ||
                      (manifestStatus !== 'NotAssigned' && manifestStatus !== 'Pending') ? (
                        <InfoIconTooltip
                          message={'Once set to scheduled, this field is managed by EPA'}
                        />
                      ) : (
                        <></>
                      )}
                    </HtForm.Label>
                    <HtForm.Select
                      id="status"
                      disabled={
                        readOnly ||
                        (manifestStatus !== 'NotAssigned' &&
                          manifestStatus !== 'Pending' &&
                          manifestStatus !== undefined)
                      }
                      aria-label="manifestStatus"
                      {...manifestMethods.register('status')}
                      // @ts-ignore
                      onChange={(event) => setManifestStatus(event.target.value)}
                    >
                      <option value="NotAssigned">Draft</option>
                      <option value="Pending">Pending</option>
                      <option value="Scheduled">Scheduled</option>
                      <option hidden value="InTransit">
                        In Transit
                      </option>
                      <option hidden value="ReadyForSignature">
                        Ready for TSDF Signature
                      </option>
                      <option hidden value="Signed">
                        Signed
                      </option>
                      <option hidden value="Corrected">
                        Corrected
                      </option>
                      <option hidden value="UnderCorrection">
                        Under Correction
                      </option>
                      <option hidden value="MtnValidationFailed">
                        MTN Validation Failed
                      </option>
                    </HtForm.Select>
                  </HtForm.Group>
                </Col>
                <Col>
                  <HtForm.Group>
                    <HtForm.Label htmlFor="submissionType" className="mb-0">
                      Manifest Type
                    </HtForm.Label>
                    <HtForm.Select
                      id="submissionType"
                      disabled={
                        readOnly ||
                        (manifestStatus !== 'NotAssigned' && manifestStatus !== 'Pending')
                      }
                      aria-label="submissionType"
                      {...manifestMethods.register('submissionType')}
                    >
                      <option value="FullElectronic">Electronic</option>
                      <option value="Hybrid">Hybrid</option>
                      <option hidden value="DataImage5Copy">
                        Data + Image
                      </option>
                      <option hidden value="Image">
                        Image Only
                      </option>
                    </HtForm.Select>
                  </HtForm.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <HtForm.Group>
                    <HtForm.Label htmlFor="createdDate">
                      {'Created Date '}
                      <InfoIconTooltip message={'This field is managed by EPA'} />
                    </HtForm.Label>
                    <Form.Control
                      id="createdDate"
                      plaintext
                      disabled
                      type="date"
                      value={manifestData?.createdDate?.slice(0, 10)}
                      {...manifestMethods.register('createdDate')}
                      className={errors.createdDate && 'is-invalid'}
                    />
                    <div className="invalid-feedback">{errors.createdDate?.message}</div>
                  </HtForm.Group>
                </Col>
                <Col>
                  <HtForm.Group>
                    <HtForm.Label htmlFor="updatedDate">
                      {'Last Update Date '}
                      <InfoIconTooltip message={'This field is managed by EPA'} />
                    </HtForm.Label>
                    <Form.Control
                      id="updatedDate"
                      plaintext
                      disabled
                      type="date"
                      value={manifestData?.updatedDate?.slice(0, 10)}
                      {...manifestMethods.register('updatedDate')}
                      className={errors.updatedDate && 'is-invalid'}
                    />
                    <div className="invalid-feedback">{errors.updatedDate?.message}</div>
                  </HtForm.Group>
                </Col>
                <Col>
                  <HtForm.Group>
                    <HtForm.Label htmlFor="shippedDate">
                      {'Shipped Date '}
                      <InfoIconTooltip message={'This field is managed by EPA'} />
                    </HtForm.Label>
                    <Form.Control
                      id="shippedDate"
                      disabled
                      plaintext
                      type="date"
                      value={manifestData?.shippedDate?.slice(0, 10)}
                      {...manifestMethods.register('shippedDate')}
                      className={errors.shippedDate && 'is-invalid'}
                    />
                    <div className="invalid-feedback">
                      {errors.shippedDate?.message?.toString()}
                    </div>
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
                    className={errors.import && 'is-invalid'}
                  />
                  <div className="invalid-feedback">{errors.import?.message}</div>
                  <HtForm.Check
                    type="checkbox"
                    id="rejection"
                    disabled={readOnly}
                    label="Rejected Waste"
                    {...manifestMethods.register('rejection')}
                    className={errors.rejection && 'is-invalid'}
                  />
                  <div className="invalid-feedback">{errors.rejection?.message}</div>
                </Col>
                <Col>
                  <HtForm.Group>
                    <HtForm.Label htmlFor="potentialShipDate">Potential Ship Date</HtForm.Label>
                    <Form.Control
                      id="potentialShipDate"
                      disabled={readOnly}
                      type="date"
                      {...manifestMethods.register('potentialShipDate')}
                      className={errors.potentialShipDate && 'is-invalid'}
                    />
                    <div className="invalid-feedback">{errors.potentialShipDate?.message}</div>
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
                  <RcraSiteDetails handler={generator} />
                  <h4>Emergency Contact Information</h4>
                  <ContactForm handlerType="generator" readOnly={readOnly} />
                  <div className="d-flex justify-content-between">
                    {/* Button to bring up the Quicker Sign modal*/}
                    <Col className="text-end">
                      <QuickerSignModalBtn
                        siteType={'Generator'}
                        mtnHandler={generator}
                        handleClick={setupSign}
                        disabled={generator?.signed || !signAble}
                      />
                    </Col>
                  </div>
                </>
              ) : (
                <>
                  <HandlerForm handlerType={HandlerType.enum.generator} readOnly={readOnly} />
                  <h4>Emergency Contact Information</h4>
                  <ContactForm handlerType="generator" readOnly={readOnly} />
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
                setupSign={setupSign}
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
                  <RcraSiteDetails handler={tsdf} />
                  <div className="d-flex justify-content-between">
                    {/* Button to bring up the Quicker Sign modal*/}
                    <Col className="text-end">
                      <QuickerSignModalBtn
                        siteType={'Tsdf'}
                        mtnHandler={tsdf}
                        handleClick={setupSign}
                        disabled={tsdf.signed || !signAble}
                      />
                    </Col>
                  </div>
                </>
              ) : (
                <></>
              )}
              {readOnly || tsdf ? (
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
        <AddHandler
          handleClose={toggleTranSearchShow}
          show={transFormShow}
          currentTransporters={transporters}
          appendTransporter={tranArrayMethods.append}
          handlerType="transporter"
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
        <AddHandler
          handleClose={toggleTsdfFormShow}
          show={tsdfFormShow}
          handlerType="designatedFacility"
        />
      </FormProvider>
    </>
  );
}
