// manifest type declaration

import { Signer } from './Contact';
import { Handler, Locality } from 'types/Handler/Handler';
import { CorrectionInfo, CorrectionRequest } from './Correction';
import { RejectionInfo } from './Rejection';
import { WasteLine } from 'types/WasteLine';
import { Transporter } from 'types/Transporter/Transporter';

interface Manifest {
  createdDate?: string;
  updatedDate?: string;
  manifestTrackingNumber?: string;
  status?: Status;
  isPublic?: boolean;
  submissionType?: SubmissionType;
  signatureStatus: boolean;
  originType?: OriginType;
  shippedDate: string;
  potentialShipDate: string;
  receivedDate: string;
  certifiedDate: string;
  certifiedBy: Signer;
  generator: Handler;
  transporters: [Transporter];
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
  printedDocument: Document;
  formDocument: Document;
  additionalInfo: AdditionalInfo;
  correctionInfo?: CorrectionInfo;
  ppcStatus: PpcStatus;
  // mtnValidationInfo
  provideImageGeneratorInfo: boolean;
  locked: boolean;
  lockReason: LockReason;
}

enum Status {
  NotAssigned = 'Not Assigned',
  Pending = 'Pending',
  Scheduled = 'Pending',
  InTransit = 'In Transit',
  ReadyForSignature = 'Ready for Signature',
  Signed = 'Signed',
  Corrected = 'Corrected',
  UnderCorrection = 'Under Correction',
  MtnValidationFailed = 'MTN Validation Failed',
}

enum SubmissionType {
  FullElectronic,
  DataImage5Copy,
  Hybrid,
  Image,
}

enum OriginType {
  Web,
  Service,
  Mail,
}

interface ImportInfo {
  importGenerator: Handler;
  portOfEntry: PortOfEntry;
}

interface PortOfEntry {
  state: Locality;
  cityPort: string;
}

enum PpcStatus {
  Draft,
  PendingDataEntry,
  DataEntryInProgress,
  PendingDataQc,
  PendingDataQa,
  DataQaCompleted,
}

interface Document {
  name: string;
  size: number;
  mimeType: FileType;
}

enum FileType {
  APPLICATION_PDF,
  TEXT_HTML,
}

enum LockReason {
  AsyncSign,
  EpaChangeBiller,
  EpaCorrection,
}

interface AdditionalInfo {
  originalManifestTrackingNumbers: string[];
  newManifestDestination: NewManifestDestination;
  consentNumber: string;
  comments: Comment[];
}

interface Comment {
  label: string;
  description: string;
  handlerId: string;
}

enum NewManifestDestination {
  OriginalGenerator,
  Tsdf,
}

export default Manifest;
