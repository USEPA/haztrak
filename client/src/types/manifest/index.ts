import { Manifest, MtnDetails } from './manifest';
import {
  AdditionalInfo,
  AdditionalInfoComment,
} from 'components/ManifestForm/AdditionalInfo/additionalInfoSchema';
import { QuickerSignature, QuickerSignData, ElectronicSignature, Signer } from './signatures';
import { CorrectionInfo, CorrectionRequest } from './correction';

export type {
  Manifest,
  MtnDetails,
  AdditionalInfo,
  AdditionalInfoComment,
  CorrectionInfo,
  CorrectionRequest,
  QuickerSignature,
  QuickerSignData,
  ElectronicSignature,
  Signer,
};
