/**
 * Used to specify whether a siteAddress or mailingAddress
 */
export enum AddressType {
  site = 'siteAddress',
  mail = 'mailingAddress',
}

/**
 * Object representing address information for handlers on a hazardous waste manifest
 */
export interface Address {
  address1: string;
  address2?: string;
  city: string;
  country: Locality;
  state: Locality;
  streetNumber: string;
  zip: string;
}

/**
 * An object, used by RCRAInfo, that represents a geographic region, such as States and Countries.
 */
export interface Locality {
  /**
   * A, usually two character string, that acts as a unique identifier for the geographic region
   */
  code: string;
  /**
   * Optional name of the region
   */
  name?: string;
}

/**
 * Enum representing the different state choices, as defined by RCRAInfo
 */
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
