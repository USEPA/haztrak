import { Handler } from 'types/Handler';

export interface RejectionInfo {
  rejectionType: RejectionType;
  alternateDesignatedFacilityType: AlternateDesignatedFacilityType;
  // generatorPaperSignature: ???
  // generatorElectronicSignature: ???
  alternateDesignatedFacility: Handler;
  newManifestTrackingNumber: string;
  rejectionComments: string;
}

enum RejectionType {
  FullReject,
  PartialReject,
}

enum AlternateDesignatedFacilityType {
  Generator,
  Tsdf,
}
