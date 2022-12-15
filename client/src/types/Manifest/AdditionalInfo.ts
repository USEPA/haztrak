/**
 * Comments and reference information for other objects such Manifest and WasteLine
 */
export interface AdditionalInfo {
  originalManifestTrackingNumbers: string[];
  newManifestDestination: NewManifestDestination;
  consentNumber: string;
  comments: AdditionalInfoComment[];
}

/**
 * Comments which can be 'attached' to a handler EPA ID number
 */
export interface AdditionalInfoComment {
  label?: string;
  description?: string;
  handlerId?: string;
}

/**
 * Used to denote the new destination of rejected waste shipments
 */
enum NewManifestDestination {
  OriginalGenerator,
  Tsdf,
}
