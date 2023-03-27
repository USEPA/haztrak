/**
 * The EPA Quicker Sign schema
 */
export interface QuickerSignature {
  siteId: string;
  siteType: 'Transporter' | 'Generator' | 'Tsdf' | 'Broker';
  transporterOrder?: number;
  printedSignatureName: string;
  printedSignatureDate: string;
  manifestTrackingNumbers: Array<string>;
}

/**
 * Input from the user for Quicker Signing manifest
 */
export interface QuickerSignForm {
  printedSignatureName: string;
  printedSignatureDate: string;
}
