import { Contact, Phone } from 'types/Manifest/Contact';

export interface Handler {
  name: string;
  epaSiteId: string;
  mailingAddress: Address;
  siteAddress: Address;
  contact: Contact;
  emergencyPhone: Phone;
  order?: number;
  registered?: boolean;
  modified?: boolean;
  limitedEsign?: boolean;
  canEsign?: boolean;
  siteState?: Locality;
  hasRegisteredEmanifestUser?: boolean;
  gisPrimary?: boolean;
}

export interface ManifestHandler extends Handler {
  // paperSignatureInfo: PaperSignature
  electronicSignatureInfo?: Array<ElectronicSignature>;
}

export interface ElectronicSignature {
  signer?: Signer;
  signatureDate?: string;
}

export interface Signer {
  firstName?: string;
  middleInitial?: string;
  lastName?: string;
  companyName?: string;
}

/**
 * Used to specify whether a handler is a generator, transporter, or tsdf.
 */
export enum HandlerType {
  Generator = 'generator',
  Tsd = 'designatedFacility',
  Transporter = 'transporter',
}

export type HandlerTypeString = `${HandlerType}`;

/**
 * Used to specify whether a siteAddress or mailingAddress
 */
export enum AddressType {
  site = 'siteAddress',
  mail = 'mailingAddress',
}

/**
 * The RCRAInfo Address interface
 */
export interface Address {
  address1: string;
  city: string;
  country: Locality;
  state: Locality;
  streetNumber: string;
  zip: string;
}

export interface Locality {
  code: string;
  name?: string;
}

export enum StateCode {
  AK = 'Alaska',
  AL = 'Alabama',
  AP = 'Armed Forces Pacific',
  AR = 'Arkansas',
  AZ = 'Arizona',
  CA = 'California',
  CO = 'Colorado',
  CT = 'Connecticut',
  DC = 'Washington DC',
  DE = 'Delaware',
  FL = 'Florida',
  GA = 'Georgia',
  GU = 'Guam',
  HI = 'Hawaii',
  IA = 'Iowa',
  ID = 'Idaho',
  IL = 'Illinois',
  IN = 'Indiana',
  KS = 'Kansas',
  KY = 'Kentucky',
  LA = 'Louisiana',
  MA = 'Massachusetts',
  MD = 'Maryland',
  ME = 'Maine',
  MI = 'Michigan',
  MN = 'Minnesota',
  MO = 'Missouri',
  MS = 'Mississippi',
  MT = 'Montana',
  NC = 'North Carolina',
  ND = 'North Dakota',
  NE = 'Nebraska',
  NH = 'New Hampshire',
  NJ = 'New Jersey',
  NM = 'New Mexico',
  NV = 'Nevada',
  NY = 'New York',
  OH = 'Ohio',
  OK = 'Oklahoma',
  OR = 'Oregon',
  PA = 'Pennsylvania',
  PR = 'Puerto Rico',
  RI = 'Rhode Island',
  SC = 'South Carolina',
  SD = 'South Dakota',
  TN = 'Tennessee',
  TX = 'Texas',
  UT = 'Utah',
  VA = 'Virginia',
  VI = 'Virgin Islands',
  VT = 'Vermont',
  WA = 'Washington',
  WI = 'Wisconsin',
  WV = 'West Virginia',
  WY = 'Wyoming',
  XA = 'REGION 01 PURVIEW',
  XB = 'REGION 02 PURVIEW',
  XC = 'REGION 03 PURVIEW',
  XD = 'REGION 04 PURVIEW',
  XE = 'REGION 05 PURVIEW',
  XF = 'REGION 06 PURVIEW',
  XG = 'REGION 07 PURVIEW',
  XH = 'REGION 08 PURVIEW',
  XI = 'REGION 09 PURVIEW',
  XJ = 'REGION 10 PURVIEW',
}
