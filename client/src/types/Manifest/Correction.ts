import { Locality } from 'types/Handler';

export interface CorrectionRequest {
  correctionRequestStatus: CorrectionRequestStatus;
  correctionRequestDate: string;
  initiatorState: Locality;
  active: boolean;
  // stateUser
  // sections
}

enum CorrectionRequestStatus {
  NotSend,
  Sent,
  IndustryResponded,
}

export interface CorrectionInfo {
  versionNumber: number;
  active: boolean;
  ppcActive: boolean;
  // electronicSignatureInfo
  // epaSiteId
  initiatorRole: PartyRole;
  updateRole: PartyRole;
}

enum PartyRole {
  Industry,
  State,
  Ppc,
  Epa,
}
