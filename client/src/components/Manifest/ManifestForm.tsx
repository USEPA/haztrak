import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { AdditionalInfoForm } from 'components/Manifest/AdditionalInfo';
import { UpdateRcra } from 'components/Manifest/UpdateRcra/UpdateRcra';
import { WasteLine } from 'components/Manifest/WasteLine/wasteLineSchema';
import { RcraSiteDetails } from 'components/RcraSite';
import { HtButton, HtCard, HtForm, InfoIconTooltip } from 'components/UI';
import React, { createContext, useState } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { manifest, manifestApi } from 'services';
import { ContactForm, PhoneForm } from './Contact';
import { AddHandler, GeneratorForm, Handler } from './Handler';
import { Manifest, manifestSchema, ManifestStatus } from './manifestSchema';
import { HandlerSignBtn, QuickerSignData, QuickerSignModal } from './QuickerSign';
import { Transporter, TransporterTable } from './Transporter';
import { EditWasteModal, WasteLineTable } from './WasteLine';

const defaultValues: Manifest = {
  transporters: [],
  wastes: [],
  status: 'NotAssigned',
  submissionType: 'FullElectronic',
};

export interface ManifestContextType {
  manifestStatus?: ManifestStatus;
  generatorStateCode?: string;
  setGeneratorStateCode: React.Dispatch<React.SetStateAction<string | undefined>>;
  tsdfStateCode?: string;
  setTsdfStateCode: React.Dispatch<React.SetStateAction<string | undefined>>;
  editWasteLineIndex?: number;
  setEditWasteLineIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
  signingSite?: string | undefined;
}

interface ManifestFormProps {
  readOnly?: boolean;
  manifestData?: Partial<Manifest>;
  manifestingSiteID?: string;
  mtn?: string;
}

export const ManifestContext = createContext<ManifestContextType>({
  manifestStatus: undefined,
  generatorStateCode: undefined,
  setGeneratorStateCode: () => {},
  tsdfStateCode: undefined,
  setTsdfStateCode: () => {},
  editWasteLineIndex: undefined,
  setEditWasteLineIndex: () => {},
  signingSite: undefined,
});

/**
 * Used to collect and display electronic hazardous waste manifests.
 * @param readOnly - If true, the form will be read only and the user will not be able to edit the form.
 * @param manifestData<Partial> - If provided, the form will be pre-populated with the data provided.
 * @param manifestingSiteID - The ID of the site that is creating the manifest.
 * @param mtn - The manifest tracking number of the manifest being edited, or 'Draft' if creating a new manifest.
 * @constructor
 */
export function ManifestForm({
  readOnly,
  manifestData,
  manifestingSiteID,
  mtn,
}: ManifestFormProps) {
  const navigate = useNavigate();

  // Use default values, override with manifestData if provided
  let values: Manifest = defaultValues;
  if (manifestData) {
    values = {
      ...defaultValues,
      ...manifestData,
    };
  }

  // State related to inter-system communications with EPA's RCRAInfo system
  const [updatingRcrainfo, setUpdatingRcrainfo] = useState<boolean>(false);
  const toggleShowUpdatingRcra = () => setUpdatingRcrainfo(!updatingRcrainfo);
  const [taskId, setTaskId] = useState<string | undefined>(undefined);

  // React-Hook-Form component state and methods
  const manifestForm = useForm<Manifest>({
    values: values,
    resolver: zodResolver(manifestSchema),
  });
  const {
    formState: { errors },
  } = manifestForm;

  const onSubmit: SubmitHandler<Manifest> = (data: Manifest) => {
    manifestApi
      .createManifest(data)
      .then((r) => {
        if ('manifestTrackingNumber' in r.data) {
          navigate(`/manifest/${r.data.manifestTrackingNumber}/view`);
        }
        if ('taskId' in r.data) {
          setTaskId(r.data.taskId);
          toggleShowUpdatingRcra();
        }
      })
      .catch((error: AxiosError) => toast.error(error.message));
  };

  // Generator component state and methods
  const generator: Handler | undefined = manifestForm.getValues('generator');
  const [showGeneratorSearch, setShowGeneratorSearch] = useState<boolean>(false);
  const [showGeneratorForm, setShowGeneratorForm] = useState<boolean>(false);
  const toggleShowAddGenerator = () => setShowGeneratorSearch(!showGeneratorSearch);
  const toggleShowGeneratorForm = () => setShowGeneratorForm(!showGeneratorForm);
  const [generatorStateCode, setGeneratorStateCode] = useState<string | undefined>(
    manifestData?.generator?.siteAddress.state.code
  );

  // Transporter component state and methods
  const [showAddTransporterForm, setShowAddTransporterForm] = useState<boolean>(false);
  const toggleTranSearchShow = () => setShowAddTransporterForm(!showAddTransporterForm);
  const transporters: Array<Transporter> = manifestForm.getValues('transporters');
  const transporterForm = useFieldArray<Manifest, 'transporters'>({
    control: manifestForm.control,
    name: 'transporters',
  });

  // DesignatedFacility (TSDF) component state and methods
  const [tsdfFormShow, setTsdfFormShow] = useState<boolean>(false);
  const toggleTsdfFormShow = () => setTsdfFormShow(!tsdfFormShow);
  const tsdf: Handler | undefined = manifestForm.getValues('designatedFacility');
  const [tsdfStateCode, setTsdfStateCode] = useState<string | undefined>(
    manifestData?.designatedFacility?.siteAddress.state.code
  );

  // Quicker Sign component state and methods
  const [showSignForm, setShowSignForm] = useState<boolean>(false);
  const [quickerSignHandler, setQuickerSignHandler] = useState<QuickerSignData>({
    handler: undefined,
    siteType: 'Generator',
  });
  const toggleQuickerSignShow = () => setShowSignForm(!showSignForm);
  const setupSign = (signContext: QuickerSignData) => {
    setQuickerSignHandler(signContext); // set state to appropriate Handler
    toggleQuickerSignShow(); // Toggle the Quicker Sign modal
  };

  // Waste Line component state and methods
  const [showWasteLineForm, setShowWasteLineForm] = useState<boolean>(false);
  const toggleWlFormShow = () => setShowWasteLineForm(!showWasteLineForm);
  const [editWasteLine, setEditWasteLine] = useState<number | undefined>(undefined);
  const allWastes: Array<WasteLine> = manifestForm.getValues('wastes');
  const wasteForm = useFieldArray<Manifest, 'wastes'>({
    control: manifestForm.control,
    name: 'wastes',
  });

  const [manifestStatus, setManifestStatus] = useState<ManifestStatus | undefined>(
    manifestData?.status
  );

  const signAble =
    manifestStatus === 'Scheduled' ||
    manifestStatus === 'InTransit' ||
    manifestStatus === 'ReadyForSignature';

  const isDraft = manifestData?.manifestTrackingNumber === undefined;

  return (
    <>
      <ManifestContext.Provider
        value={{
          generatorStateCode: generatorStateCode,
          setGeneratorStateCode: setGeneratorStateCode,
          manifestStatus: manifestStatus,
          tsdfStateCode: tsdfStateCode,
          setTsdfStateCode: setTsdfStateCode,
          editWasteLineIndex: editWasteLine,
          setEditWasteLineIndex: setEditWasteLine,
          signingSite: manifest.getNextSigner(manifestData),
        }}
      >
        <FormProvider {...manifestForm}>
          <HtForm onSubmit={manifestForm.handleSubmit(onSubmit)}>
            <div className="d-flex justify-content-between">
              <h2 className="fw-bold mt-2">
                {`${manifestData?.manifestTrackingNumber || 'Draft Manifest'}`}
                {manifestData?.manifestTrackingNumber?.endsWith('DFT') && (
                  <sup className="text-info"> (draft)</sup>
                )}
              </h2>
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
                        {...manifestForm.register('manifestTrackingNumber')}
                        className={errors.manifestTrackingNumber && 'is-invalid'}
                      />
                      <div className="invalid-feedback">
                        {errors.manifestTrackingNumber?.message}
                      </div>
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
                        disabled={readOnly || !isDraft}
                        aria-label="manifestStatus"
                        {...manifestForm.register('status')}
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
                        disabled={readOnly || !isDraft}
                        aria-label="submissionType"
                        {...manifestForm.register('submissionType')}
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
                        {...manifestForm.register('createdDate')}
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
                        {...manifestForm.register('updatedDate')}
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
                        {...manifestForm.register('shippedDate')}
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
                      {...manifestForm.register('import')}
                      className={errors.import && 'is-invalid'}
                    />
                    <div className="invalid-feedback">{errors.import?.message}</div>
                    <HtForm.Check
                      type="checkbox"
                      id="rejection"
                      disabled={readOnly}
                      label="Rejected Waste"
                      {...manifestForm.register('rejection')}
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
                        {...manifestForm.register('potentialShipDate')}
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
                        <HandlerSignBtn
                          siteType={'Generator'}
                          mtnHandler={generator}
                          handleClick={setupSign}
                          disabled={generator?.signed || !signAble}
                        />
                      </Col>
                    </div>
                  </>
                ) : generator && !showGeneratorForm ? (
                  <>
                    <RcraSiteDetails handler={generator} />
                    <PhoneForm handlerType={'generator'} />
                    <div className="d-flex justify-content-end">
                      <Button onClick={toggleShowGeneratorForm}>Edit</Button>
                    </div>
                  </>
                ) : showGeneratorForm ? (
                  <>
                    <GeneratorForm readOnly={readOnly} />
                    <h4>Emergency Contact Information</h4>
                    <ContactForm handlerType="generator" readOnly={readOnly} />
                  </>
                ) : (
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
                <TransporterTable
                  transporters={transporters}
                  arrayFieldMethods={transporterForm}
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
                <WasteLineTable
                  wastes={allWastes}
                  toggleWLModal={toggleWlFormShow}
                  wasteForm={wasteForm}
                  readonly={readOnly}
                />
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
                        <HandlerSignBtn
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
                  manifestForm.reset();
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
          {/*If taking action that involves updating a manifest in RCRAInfo*/}
          {taskId && updatingRcrainfo ? <UpdateRcra taskId={taskId} /> : <></>}
          <AddHandler
            handleClose={toggleShowAddGenerator}
            show={showGeneratorSearch}
            handlerType="generator"
          />
          <AddHandler
            handleClose={toggleTranSearchShow}
            show={showAddTransporterForm}
            currentTransporters={transporters}
            appendTransporter={transporterForm.append}
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
          <EditWasteModal
            wasteForm={wasteForm}
            currentWastes={allWastes}
            handleClose={toggleWlFormShow}
            show={showWasteLineForm}
          />
        </FormProvider>
      </ManifestContext.Provider>
    </>
  );
}
