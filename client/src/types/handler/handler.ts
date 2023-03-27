import { Address, Locality } from './address';
import { Contact, Phone } from 'types/handler';

/**
 * The schema of an EPA hazardous waste handler, it serves as the base schema for
 * other schemas
 */
export interface Handler {
  name: string;
  /**
   * The RCRAInfo administered EPA ID used by registered Generators, Transporters and
   * designated receiving facilities (AKA "TSDF") listed on a hazardous waste manifest.
   * Follows a predictable format: Two Letter Activity Location Code + Up to 10 alphanumeric characters
   */
  epaSiteId: string;
  mailingAddress: Address;
  siteAddress: Address;
  contact: Contact;
  /**
   * The phone number to call if an emergency occurs during hazardous waste shipment
   */
  emergencyPhone: Phone;
  /**
   * Whether the handler has a registered user in RCRAInfo
   */
  registered?: boolean;
  modified?: boolean;
  /**
   * Indicates there a registered user with 'preparer' level access associated with the handler
   * who can 'quick sign'.
   */
  limitedEsign?: boolean;
  /**
   * Indicates there is a user associated with the site which can electronically sign
   */
  canEsign?: boolean;
  /**
   * The U.S. geographic state of the handler
   */
  siteState?: Locality;
  /**
   *
   * Indicates there is a registered user associated with the site. A registered user does
   * not necessarily mean a registered user who can electronically sign.
   */
  hasRegisteredEmanifestUser?: boolean;
  /**
   * Indicates if a site's address1 uses latitude/longitude
   */
  gisPrimary?: boolean;
}

/**
 * The Signature that appears on paper versions of the manifest
 */
export interface PaperSignature {
  printedName: string;
  signatureDate: string;
}

/**
 * The ManifestHandler extends to Handler schema and adds manifest specific data
 */
export interface ManifestHandler extends Handler {
  paperSignatureInfo?: PaperSignature;
  electronicSignaturesInfo?: Array<ElectronicSignature>;
  /**
   * Property on by back end to signify whether the handler has signed
   */
  signed?: boolean;
}

/**
 *  The Transporter type extends the ManifestHandler schema
 */
export interface Transporter extends ManifestHandler {
  order: number;
  manifest?: number;
}

/**
 *  The Site type encapsulates the Handler model as well as other details specific to
 *  that hazardous waste site. It is not directly associated with the EPA RCRAInfo system
 *  directly and can be extended as needed. For example, Haztrak users are given permission to
 *  sites, not Handlers.
 */
export interface Site {
  name: string;
  handler: Handler;
}

/**
 * EPA schema of an electronic signature
 */
export interface ElectronicSignature {
  signer?: Signer;
  signatureDate?: string;
  /**
   * Object representing metadata on a printable, human friendly, version of the manifest
   * ToDo: implement this schema, see the USEPA/e-Manifest documentation on GitHub
   */
  humanReadableDocument?: object;
}

/**
 * Used to specify whether a handler is a generator, transporter, or
 * designated receiving facility (AKA Treatment, Storage and Disposal Facility or TSD/TSDF for short).
 */
export enum HandlerType {
  Generator = 'generator',
  Tsd = 'designatedFacility',
  Transporter = 'transporter',
}

/**
 * EPA definition of a manifest signer
 */
export interface Signer {
  /**
   * User's RCRAInfo username
   */
  userId?: string;
  firstName?: string;
  middleInitial?: string;
  lastName?: string;
  phone?: Phone;
  email?: string;
  companyName?: string;
  contactType?: 'Email' | 'Text' | 'Voice';
}
