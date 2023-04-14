import { zodResolver } from '@hookform/resolvers/zod';
import { HtButton, HtCard, HtForm } from 'components/Ht';
import HandlerDetails from 'components/HandlerDetails';
import HtP from 'components/Ht/HtP';
import AdditionalInfoForm from 'components/ManifestForm/AdditionalInfo';
import ContactForm from 'components/ManifestForm/ContactForm';
import { AddTransporter, TransporterTable } from 'components/ManifestForm/Transporter';
import { WasteLineTable } from 'components/ManifestForm/WasteLine/WasteLineTable/WasteLineTable';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Handler, Transporter } from 'types/site';
import { QuickerSignData } from 'types/manifest/signatures';
import { WasteLine } from 'types/wasteLine';
import HandlerForm from './HandlerForm';
import AddTsdf from './Tsdf';
import AddWasteLine from './WasteLine';
import { QuickerSignModal, QuickerSignModalBtn } from 'components/QuickerSign';
import { manifestSchema, Manifest, HandlerType } from './manifestSchema';
import { InfoIconTooltip } from 'components/Ht/HtTooltip';

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
function ManifestForm({ readOnly, manifestData, siteId, mtn }: ManifestFormProps) {
  // Top level ManifestForm methods and objects
  const manifestMethods = useForm<Manifest>({
    values: manifestData,
    resolver: zodResolver(manifestSchema),
  });
  const {
    formState: { errors },
  } = manifestMethods;
  const isDraft = !manifestData?.manifestTrackingNumber;
  // On load, focus the generator EPA ID.
  useEffect(() => manifestMethods.setFocus('generator.epaSiteId'), []);
  // const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<Manifest> = (data: Manifest) => {
    console.log(data);
  };
  // Generator controls
  const generator: Handler = manifestMethods.getValues('generator');

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
  const tsdf: Handler = manifestMethods.getValues('designatedFacility');

  const signAble =
    manifestData?.status === 'Scheduled' ||
    manifestData?.status === 'InTransit' ||
    manifestData?.status === 'ReadyForSignature';

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
                        <option value="ReadyForSignature">Ready for Signature</option>
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
                    <HtForm.Label htmlFor="createdDate">
                      {'Created Date '}
                      <InfoIconTooltip message={'This field is managed by EPA'} />
                    </HtForm.Label>
                    <Form.Control
                      id="createdDate"
                      plaintext
                      disabled
                      type="date"
                      {...manifestMethods.register('createdDate', { valueAsDate: true })}
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
                      disabled={readOnly}
                      type="date"
                      {...manifestMethods.register('updatedDate', { valueAsDate: true })}
                      className={errors.updatedDate && 'is-invalid'}
                    />
                    <div className="invalid-feedback">{errors.updatedDate?.message}</div>
                  </HtForm.Group>
                </Col>
                <Col>
                  <HtForm.Group>
                    <HtForm.Label htmlFor="shippedDate">Shipped Date</HtForm.Label>
                    <Form.Control
                      id="shippedDate"
                      disabled={readOnly}
                      type="date"
                      {...manifestMethods.register('shippedDate', { valueAsDate: true })}
                      className={errors.shippedDate && 'is-invalid'}
                    />
                    <div className="invalid-feedback">{errors.shippedDate?.message}</div>
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
                    <HtForm.Label htmlFor="potentialShipDate">Potential Shipped Date</HtForm.Label>
                    <Form.Control
                      id="potentialShipDate"
                      disabled={readOnly}
                      type="date"
                      {...manifestMethods.register('potentialShipDate', { valueAsDate: true })}
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
                  <HandlerDetails handler={generator} />
                  <h4>Emergency Contact Information</h4>
                  <ContactForm handlerFormType="generator" readOnly={readOnly} />
                  <div className="d-flex justify-content-between">
                    {/* Button to bring up the Quicker Sign modal*/}
                    <Col className="text-end">
                      <QuickerSignModalBtn
                        siteType={'Generator'}
                        mtnHandler={generator}
                        handleClick={setupSign}
                        disabled={generator.signed || !signAble}
                      />
                    </Col>
                  </div>
                </>
              ) : (
                <>
                  <HandlerForm handlerType={HandlerType.enum.generator} readOnly={readOnly} />
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
                  <HandlerDetails handler={tsdf} />
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
