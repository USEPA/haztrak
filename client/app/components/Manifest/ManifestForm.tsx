import { zodResolver } from '@hookform/resolvers/zod';
import React, { createContext, useEffect, useState } from 'react';
import { Container, Stack } from 'react-bootstrap';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import {
  ManifestCancelBtn,
  ManifestEditBtn,
  ManifestFABs,
  ManifestSaveBtn,
} from '~/components/Manifest/Actions';
import { AdditionalInfoForm } from '~/components/Manifest/AdditionalInfo';
import { GeneralInfoForm } from '~/components/Manifest/GeneralInfo';
import { GeneratorSection } from '~/components/Manifest/Generator';
import { TransporterSection } from '~/components/Manifest/Transporter/TransporterSection';
import { TsdfSection } from '~/components/Manifest/Tsdf';
import { UpdateRcra } from '~/components/Manifest/UpdateRcra/UpdateRcra';
import { WasteLineSection } from '~/components/Manifest/WasteLine/WasteLineSection';
import { WasteLine } from '~/components/Manifest/WasteLine/wasteLineSchema';
import { HtCard, HtForm } from '~/components/legacyUi';
import { useUserSiteIds } from '~/hooks';
import { useManifestStatus, useReadOnly, useSaveManifest } from '~/hooks/manifest';
import { manifest } from '~/services';
import { HandlerSearchModal } from './Handler';
import { QuickerSignData, QuickerSignModal } from './QuickerSign';
import { EditWasteModal } from './WasteLine';
import { Manifest, SiteType, manifestSchema } from './manifestSchema';

const defaultValues: Manifest = {
  transporters: [],
  wastes: [],
  status: 'NotAssigned',
  submissionType: 'Hybrid',
};

export interface ManifestContextType {
  trackingNumber?: string;
  generatorStateCode?: string;
  setGeneratorStateCode: React.Dispatch<React.SetStateAction<string | undefined>>;
  tsdfStateCode?: string;
  setTsdfStateCode: React.Dispatch<React.SetStateAction<string | undefined>>;
  editWasteLineIndex?: number;
  setEditWasteLineIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
  nextSigningSite?: { epaSiteId: string; siteType: SiteType; transporterOrder?: number };
  viewingAsSiteId?: string;
  signAble?: boolean;
}

export const ManifestContext = createContext<ManifestContextType>({
  trackingNumber: undefined,
  generatorStateCode: undefined,
  setGeneratorStateCode: () => {},
  tsdfStateCode: undefined,
  setTsdfStateCode: () => {},
  editWasteLineIndex: undefined,
  setEditWasteLineIndex: () => {},
  nextSigningSite: undefined,
  viewingAsSiteId: undefined,
});

interface ManifestFormProps {
  readOnly?: boolean;
  manifestData?: Partial<Manifest>;
  manifestingSiteID?: string;
  mtn?: string;
}

/**
 * Used to collect and display electronic hazardous waste manifests.
 * @param readOnly - If true, the form will be read only and the user will not be able to edit the form.
 * @param manifestData<Partial> - If provided, the form will be pre-populated with the data provided.
 * @param manifestingSiteID - The ID of the site that is creating the manifest.
 * @param mtn - The manifest tracking number of the manifest being edited, or 'Draft' if creating a new manifest.
 * @constructor
 */
export function ManifestForm({
  readOnly: propReadOnly,
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
  useManifestStatus(values.status);
  useReadOnly(propReadOnly);

  // State related to inter-system communications with EPA's RCRAInfo system
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [taskId, setTaskId] = useState<string | undefined>(undefined);
  const {
    isLoading: saveManifestIsLoading,
    saveManifest,
    data: saveManifestResult,
    error: saveManifestError,
    taskId: saveEmanifestTaskId,
  } = useSaveManifest();

  // React-Hook-Form component state and methods
  const manifestForm = useForm<Manifest>({
    values: values,
    resolver: zodResolver(manifestSchema),
  });

  useEffect(() => {
    if (saveManifestResult) {
      if ('manifestTrackingNumber' in saveManifestResult) {
        navigate(
          `/site/${manifestingSiteID}/manifest/${saveManifestResult.manifestTrackingNumber}/view`
        );
      }
    }
    if (saveManifestIsLoading) {
      setShowSpinner(true);
    }
    if (saveManifestError) {
      toast.error('Error creating manifest');
      setShowSpinner(false);
    }
  }, [saveManifestResult, saveManifestIsLoading, saveManifestError]);

  useEffect(() => {
    if (saveEmanifestTaskId) {
      setTaskId(saveEmanifestTaskId);
      setShowSpinner(true);
    }
  }, [saveEmanifestTaskId]);

  const onSubmit: SubmitHandler<Manifest> = (data: Manifest) => {
    saveManifest(data);
  };

  // Generator component state and methods
  const [generatorStateCode, setGeneratorStateCode] = useState<string | undefined>(
    manifestData?.generator?.siteAddress.state.code
  );

  // DesignatedFacility (TSDF) component state and methods
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
  const setupSign = () => {
    const siteType = nextSigner?.siteType;
    const rcraSiteType = manifest.siteTypeToRcraSiteType(nextSigner?.siteType);
    if (rcraSiteType === undefined || nextSigner === undefined || siteType === undefined) {
      console.error('Cannot set up quick sign. Site type is undefined');
      return;
    }
    if (siteType === 'transporter') {
      setQuickerSignHandler({
        handler: manifestForm.getValues('transporters')[nextSigner.transporterOrder || 0],
        siteType: rcraSiteType,
      });
    } else {
      setQuickerSignHandler({
        handler: manifestForm.getValues(siteType),
        siteType: rcraSiteType,
      });
    }
    toggleQuickerSignShow();
  };

  // Waste Line component state and methods
  const [showWasteLineForm, setShowWasteLineForm] = useState<boolean>(false);
  const toggleWlFormShow = () => setShowWasteLineForm(!showWasteLineForm);
  const [editWasteLine, setEditWasteLine] = useState<number | undefined>(undefined);
  const allWastes: WasteLine[] = manifestForm.getValues('wastes');
  const wasteForm = useFieldArray<Manifest, 'wastes'>({
    control: manifestForm.control,
    name: 'wastes',
  });

  const { userSiteIds } = useUserSiteIds();
  const nextSigner = manifest.getNextSigner(manifestData);
  const signAble = userSiteIds.some((siteEpaId) => siteEpaId === nextSigner?.epaSiteId || '');
  const isDraft = manifestData?.manifestTrackingNumber === undefined;

  return (
    <Container className="mb-5">
      <ManifestContext.Provider
        value={{
          trackingNumber: mtn,
          generatorStateCode: generatorStateCode,
          setGeneratorStateCode: setGeneratorStateCode,
          tsdfStateCode: tsdfStateCode,
          setTsdfStateCode: setTsdfStateCode,
          editWasteLineIndex: editWasteLine,
          setEditWasteLineIndex: setEditWasteLine,
          nextSigningSite: manifest.getNextSigner(manifestData),
          viewingAsSiteId: manifestingSiteID,
          signAble: signAble,
        }}
      >
        <FormProvider {...manifestForm}>
          <HtForm onSubmit={manifestForm.handleSubmit(onSubmit)}>
            <div className="d-flex justify-content-between">
              <h1 className="fw-bold mt-2 h2">
                {`${manifestData?.manifestTrackingNumber || 'Draft Manifest'}`}
                {manifestData?.manifestTrackingNumber?.endsWith('DFT') && (
                  <sup className="text-info"> (draft)</sup>
                )}
              </h1>
            </div>
            <Stack direction="vertical" gap={3} className="px-0 px-md-5">
              <HtCard id="general-form-card" title="General Info">
                <HtCard.Body>
                  <GeneralInfoForm manifestData={manifestData} isDraft={isDraft} />
                </HtCard.Body>
              </HtCard>
              <HtCard id="generator-form-card" title="Generator">
                <HtCard.Body>
                  <GeneratorSection setupSign={setupSign} signAble={signAble} />
                </HtCard.Body>
              </HtCard>
              <HtCard id="transporter-form-card" title="Transporters">
                <HtCard.Body className="pb-4">
                  <TransporterSection setupSign={setupSign} />
                </HtCard.Body>
              </HtCard>
              <HtCard id="waste-form-card" title="Waste">
                <HtCard.Body className="pb-4">
                  <WasteLineSection toggleWlFormShow={toggleWlFormShow} />
                </HtCard.Body>
              </HtCard>
              <HtCard id="tsdf-form-card" title="Designated Facility">
                <HtCard.Body className="pb-4">
                  <TsdfSection setupSign={setupSign} signAble={signAble} />
                </HtCard.Body>
              </HtCard>
              <HtCard id="manifest-additional-info-card" title="Additional info">
                <HtCard.Body className="px-3">
                  <AdditionalInfoForm />
                </HtCard.Body>
              </HtCard>
              <Stack gap={2} direction="horizontal" className="d-flex justify-content-end">
                <ManifestSaveBtn />
                <ManifestEditBtn />
                <ManifestCancelBtn />
              </Stack>
            </Stack>
            <ManifestFABs onSignClick={setupSign} />
          </HtForm>
          {/*If taking action that involves updating a manifest in RCRAInfo*/}
          {taskId && showSpinner ? <UpdateRcra taskId={taskId} /> : <></>}
          <HandlerSearchModal />
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
    </Container>
  );
}
