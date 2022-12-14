// manifest type declaration

import { Handler, Locality } from 'types/Handler/Handler';
import { AdditionalInfo } from 'types/Manifest/AdditionalInfo';
import { Transporter } from 'types/Transporter/Transporter';
import { WasteLine } from 'types/WasteLine';
import { Signer } from './Contact';
import { CorrectionInfo, CorrectionRequest } from './Correction';
import { RejectionInfo } from './Rejection';

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
  generator: Handler;
  transporters: Array<Transporter>;
  designatedFacility: Handler;
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

interface ImportInfo {
  importGenerator: Handler;
  portOfEntry: PortOfEntry;
}

interface PortOfEntry {
  state: Locality;
  cityPort: string;
}

interface Document {
  name: string;
  size: number;
  mimeType: 'APPLICATION_PDF' | 'TEXT_HTML';
}

export default Manifest;
