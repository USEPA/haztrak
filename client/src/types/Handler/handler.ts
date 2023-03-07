import { Address, Locality } from './address';
import { Contact, Phone } from 'types/Handler/Contact';

/**
 * @description
 * The schema of an EPA hazardous waste handler, it serves as the base schema for
 * other schemas
 */
export interface Handler {
  name: string;
  epaSiteId: string;
  mailingAddress: Address;
  siteAddress: Address;
  contact: Contact;
  emergencyPhone: Phone;
  registered?: boolean;
  modified?: boolean;
  limitedEsign?: boolean;
  canEsign?: boolean;
  siteState?: Locality;
  hasRegisteredEmanifestUser?: boolean;
  gisPrimary?: boolean;
}

/**
 * @description
 * The ManifestHandler extends to Handler schema and adds manifest specific data
 */
export interface ManifestHandler extends Handler {
  // paperSignatureInfo: PaperSignature
  electronicSignatureInfo?: Array<ElectronicSignature>;
}

/**
 *  @description
 *  The Transporter type extends the ManifestHandler schema
 */
export interface Transporter extends ManifestHandler {
  order: number;
  manifest?: number;
}

/**
 *  @description
 *  The Site type encapsulates the Handler model as well as other details specific to
 *  that hazardous waste site. It is not directly associated with the EPA RCRAInfo system
 *  directly and can be extended as needed. For example, Haztrak users are given permission to
 *  sites, not Handlers.
 */
export interface Site {
  name: string;
  handler: Handler;
  // This model can be extended to include 'waste streams' or non-RCRAInfo relevant info
}

/**
 * @description
 * EPA schema of an electronic signature
 */
export interface ElectronicSignature {
  signer?: Signer;
  signatureDate?: string;
  humanReadableDocument?: object;
}

/**
 * Used to specify whether a handler is a generator, transporter, or tsdf.
 */
export enum HandlerType {
  Generator = 'generator',
  Tsd = 'designatedFacility',
  Transporter = 'transporter',
}

/**
 * @description
 * EPA definition of a manifest signer
 */
export interface Signer {
  userId?: string;
  firstName?: string;
  middleInitial?: string;
  lastName?: string;
  phone?: Phone;
  email?: string;
  companyName?: string;
  contactType?: 'Email' | 'Text' | 'Voice';
}
