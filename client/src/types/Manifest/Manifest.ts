/**
 * Manifest related type declarations
 */

import { Handler, Locality, ManifestHandler } from 'types/Handler/Handler';
import { Transporter } from 'types/Handler/Transporter';
import { AdditionalInfo } from 'types/Manifest/AdditionalInfo';
import { WasteLine } from 'types/WasteLine';
import { Signer } from './Contact';
import { CorrectionInfo, CorrectionRequest } from './Correction';
import { RejectionInfo } from './Rejection';

/**
 * Select details about manifests for display and navigation.
 */
export interface MtnDetails {
  manifestTrackingNumber: string;
  status: string;
}

/**
 * Type definition for the uniform hazardous waste manifest
 */
interface Manifest {
  createdDate?: string;
  updatedDate?: string;
  manifestTrackingNumber?: string;
  status?:
    | 'NotAssigned'
    | 'Pending'
    | 'Scheduled'
    | 'InTransit'
    | 'ReadyForSignature'
    | 'Signed'
    | 'Corrected'
    | 'UnderCorrection'
    | 'MtnValidationFailed';
  isPublic?: boolean;
  submissionType?: 'FullElectronic' | 'DataImage5Copy' | 'Hybrid' | 'Image';
  signatureStatus?: boolean;
  originType?: 'Web' | 'Service' | 'Mail';
  shippedDate?: string;
  potentialShipDate: string;
  receivedDate?: string;
  certifiedDate?: string;
  certifiedBy?: Signer;
  generator: ManifestHandler;
  transporters: Array<Transporter>;
  designatedFacility: ManifestHandler;
  broker?: Handler;
  wastes: WasteLine[];
  rejection: boolean;
  rejectionInfo?: RejectionInfo;
  discrepancy?: boolean;
  residue?: boolean;
  residueNewManifestTrackingNumber?: string[];
  import?: boolean;
  importInfo?: ImportInfo;
  correctionRequests?: CorrectionRequest[];
  containsPreviousRejectOrResidue: boolean;
  printedDocument?: Document;
  formDocument?: Document;
  additionalInfo?: AdditionalInfo;
  correctionInfo?: CorrectionInfo;
  ppcStatus?:
    | 'Draft'
    | 'PendingDataEntry'
    | 'DataEntryInProgress'
    | 'PendingDataQc'
    | 'PendingDataQa'
    | 'DataQaCompleted';
  // mtnValidationInfo
  provideImageGeneratorInfo?: boolean;
  locked: boolean;
  lockReason?: 'AsyncSign' | 'EpaChangeBiller' | 'EpaCorrection';
}

/**
 * Details required if the hazardous waste is internationally imported
 */
interface ImportInfo {
  importGenerator: Handler;
  portOfEntry: PortOfEntry;
}

/**
 * Location info on imported waste
 */
interface PortOfEntry {
  state: Locality;
  cityPort: string;
}

/**
 * Metadata for the manifest file (PDFs, HTML)
 */
interface Document {
  name: string;
  size: number;
  mimeType: 'APPLICATION_PDF' | 'TEXT_HTML';
}

export default Manifest;
