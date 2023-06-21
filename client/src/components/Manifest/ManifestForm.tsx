import { zodResolver } from '@hookform/resolvers/zod';
import { HtButton, HtCard, HtForm, InfoIconTooltip } from 'components/Ht';
import { RcraSiteDetails } from 'components/RcraSite';
import { ContactForm, PhoneForm } from './Contact';
import { Transporter, TransporterTable } from './Transporter';
import { WasteLineTable, AddWasteLine } from './WasteLine';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { QuickerSignData } from './QuickerSign';
import { WasteLine } from 'components/Manifest/WasteLine/wasteLineSchema';
import { AddHandler, Handler, HandlerForm } from './Handler';
import { QuickerSignModal, QuickerSignModalBtn } from './QuickerSign';
import { manifestSchema, Manifest, ManifestStatus } from './manifestSchema';
import { AdditionalInfoForm } from 'components/AdditionalInfo/AdditionalInfoForm';
import { ErrorMessage } from '@hookform/error-message';

const defaultValues: Manifest = {
  transporters: [],
  wastes: [],
  status: 'NotAssigned',
  submissionType: 'FullElectronic',
};

interface ManifestFormProps {
  readOnly?: boolean;
  manifestData?: Partial<Manifest>;
  manifestingSiteID?: string;
  mtn?: string;
}

/**
 * Returns form for the uniform hazardous waste manifest. It also acts
 * as the current method of viewing manifest when the form is read only.
 * @constructor
 */
export function ManifestForm({
  readOnly,
  manifestData,
  manifestingSiteID,
  mtn,
}: ManifestFormProps) {
  // methods and top level state related to the manifest to be rendered
  let values: Manifest = defaultValues;
  if (manifestData) {
    values = {
      ...defaultValues,
      ...manifestData,
    };
  }
  // React-Hook-Form methods and state
  const manifestMethods = useForm<Manifest>({
    values: values,
    resolver: zodResolver(manifestSchema),
  });
  const {
    formState: { errors },
  } = manifestMethods;
  const [manifestStatus, setManifestStatus] = useState<ManifestStatus | undefined>(
    manifestData?.status
  );
  useEffect(() => manifestMethods.setFocus('status'), []);
  const navigate = useNavigate();

  // Function to handle form submission
  const onSubmit: SubmitHandler<Manifest> = (data: Manifest) => {
    console.log('Manifest Submitted', data);
  };

  // Generator state and methods
  const generator: Handler | undefined = manifestMethods.getValues('generator');
  const [showAddGenerator, setShowAddGenerator] = useState<boolean>(false);
  const [showGeneratorForm, setShowGeneratorForm] = useState<boolean>(false);
  const toggleShowAddGenerator = () => setShowAddGenerator(!showAddGenerator);
  const toggleShowGeneratorForm = () => setShowGeneratorForm(!showGeneratorForm);

  // Transporter state and methods
  const [showAddTransporterForm, setShowAddTransporterForm] = useState<boolean>(false);
  const toggleTranSearchShow = () => setShowAddTransporterForm(!showAddTransporterForm);
  const transporters: Array<Transporter> = manifestMethods.getValues('transporters');
  const tranArrayMethods = useFieldArray<Manifest, 'transporters'>({
    control: manifestMethods.control,
    name: 'transporters',
  });

  // State and methods for the manifest's designatedFacility field (TSDF)
  const [tsdfFormShow, setTsdfFormShow] = useState<boolean>(false);
  const toggleTsdfFormShow = () => setTsdfFormShow(!tsdfFormShow);
  const tsdf: Handler | undefined = manifestMethods.getValues('designatedFacility');

  // Quicker Sign state and methods
  const [showSignForm, setShowSignForm] = useState<boolean>(false);
  const [quickerSignHandler, setQuickerSignHandler] = useState<QuickerSignData>({
    handler: undefined,
    siteType: 'Generator', // ToDo initialize to undefined
  });
  const toggleQuickerSignShow = () => setShowSignForm(!showSignForm);
  // function used to control the QuickerSign form (modal) and pass the necessary context
  const setupSign = (signContext: QuickerSignData) => {
    setQuickerSignHandler(signContext); // set state to appropriate Handler
    toggleQuickerSignShow(); // Toggle the Quicker Sign modal
  };

  // State and methods for the manifest's waste lines
  const [showWasteLineForm, setShowWasteLineForm] = useState<boolean>(false);
  const toggleWlFormShow = () => setShowWasteLineForm(!showWasteLineForm);
  const wastes: Array<WasteLine> = manifestMethods.getValues('wastes');
  const wasteArrayMethods = useFieldArray<Manifest, 'wastes'>({
    control: manifestMethods.control,
    name: 'wastes',
  });

  // Indicates whether the manifest is in a status that can be signed by any of the handlers
  const signAble =
    manifestStatus === 'Scheduled' ||
    manifestStatus === 'InTransit' ||
    manifestStatus === 'ReadyForSignature';

  const isDraft = manifestData?.manifestTrackingNumber === undefined;

  // Keep this here for development purposes
  // console.log(manifestData);
  // if (errors) console.log('errors', errors);

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
                        !manifestData?.manifestTrackingNumber
                          ? 'Draft Manifest'
                          : manifestData?.manifestTrackingNumber
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
                      {!isDraft && (
                        <InfoIconTooltip
                          message={'Once set to scheduled, this field is managed by EPA'}
                        />
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
                      onChange={(event) =>
                        setManifestStatus(event.target.value as ManifestStatus | undefined)
                      }
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
                      aria-label={'created date'}
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
                // if readOnly is true, show the generator in a nice read only way and display
                // the button to sign for the generator.
                <>
                  <RcraSiteDetails handler={generator} />
                  <h4>Emergency Contact Information</h4>
                  <ContactForm handlerType="generator" readOnly={readOnly} />
                  <div className="d-flex justify-content-between">
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
              ) : generator && !showGeneratorForm ? (
                // If the form holds a value for generator, but they don't need to edit the
                // generators values (allowed) then display the site details in a nice read only way
                <>
                  <RcraSiteDetails handler={generator} />
                  <PhoneForm handlerType={'generator'} />
                  <div className="d-flex justify-content-end">
                    <Button onClick={toggleShowGeneratorForm}>Edit</Button>
                  </div>
                </>
              ) : showGeneratorForm ? (
                // Show the Handler form with current value for the generator
                // The HandlerForm allows for fine-grained control over the handler inputs
                <>
                  <HandlerForm handlerType={'generator'} readOnly={readOnly} />
                  <h4>Emergency Contact Information</h4>
                  <ContactForm handlerType="generator" readOnly={readOnly} />
                </>
              ) : (
                // default on a blank manifest, ask if they'd like to search for a generator to
                // add, or if the user would like to manually enter the generator's info.
                <>
                  <Row className="mb-2">
                    <HtButton
                      onClick={toggleShowAddGenerator}
                      children={'Add Generator'}
                      variant="success"
                    />
                  </Row>
                  <Row>
                    <HtButton
                      onClick={toggleShowGeneratorForm}
                      children={'Manually enter The Generator'}
                      variant="primary"
                    />
                  </Row>
                </>
              )}
              <ErrorMessage
                errors={errors}
                name={'generator'}
                render={({ message }) => {
                  if (!message) return null;
                  return (
                    <Alert variant="danger" className="text-center m-3">
                      {message}
                    </Alert>
                  );
                }}
              />
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
              <ErrorMessage
                errors={errors}
                name={'transporters'}
                render={({ message }) => (
                  <Alert variant="danger" className="text-center m-3">
                    {message}
                  </Alert>
                )}
              />
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
              <ErrorMessage
                errors={errors}
                name={'wastes'}
                render={({ message }) => (
                  <Alert variant="danger" className="text-center m-3">
                    {message}
                  </Alert>
                )}
              />
            </HtCard.Body>
          </HtCard>
          {/* Where The Tsdf information is added and displayed */}
          <HtCard id="tsdf-form-card">
            <HtCard.Header title="Designated Facility" />
            <HtCard.Body className="pb-4">
              {tsdf ? (
                <>
                  <RcraSiteDetails handler={tsdf} />
                  <PhoneForm handlerType={'designatedFacility'} />
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
              <ErrorMessage
                errors={errors}
                name={'designatedFacility'}
                render={({ message }) => {
                  if (!message) return null;
                  return (
                    <Alert variant="danger" className="text-center m-3">
                      {message}
                    </Alert>
                  );
                }}
              />
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
                  navigate(`/site/${manifestingSiteID}/manifest/${mtn}/view`);
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={!readOnly}
              onClick={() => navigate(`/site/${manifestingSiteID}/manifest/${mtn}/edit`)}
            >
              Edit
            </Button>
          </div>
        </HtForm>
        <AddHandler
          handleClose={toggleShowAddGenerator}
          show={showAddGenerator}
          handlerType="generator"
        />
        <AddHandler
          handleClose={toggleTranSearchShow}
          show={showAddTransporterForm}
          currentTransporters={transporters}
          appendTransporter={tranArrayMethods.append}
          handlerType="transporter"
        />
        <AddHandler
          handleClose={toggleTsdfFormShow}
          show={tsdfFormShow}
          handlerType="designatedFacility"
        />
        <QuickerSignModal
          handleClose={toggleQuickerSignShow}
          show={showSignForm}
          mtn={[mtn ? mtn : '']}
          mtnHandler={quickerSignHandler.handler}
          siteType={quickerSignHandler.siteType}
        />
        <AddWasteLine
          appendWaste={wasteArrayMethods.append}
          currentWastes={wastes}
          handleClose={toggleWlFormShow}
          show={showWasteLineForm}
        />
      </FormProvider>
    </>
  );
}
