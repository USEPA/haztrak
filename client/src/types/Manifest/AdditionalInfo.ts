export interface AdditionalInfo {
  originalManifestTrackingNumbers: string[];
  newManifestDestination: NewManifestDestination;
  consentNumber: string;
  comments: AdditionalInfoComment[];
}

export interface AdditionalInfoComment {
  label?: string;
  description?: string;
  handlerId?: string;
}

enum NewManifestDestination {
  OriginalGenerator,
  Tsdf,
}
