import {Contact, EmergencyPhone} from './Contact';

export interface Handler {
  name: string;
  epaSiteId: string;
  mailingAddress: Address;
  siteAddress: Address;
  contact: Contact;
  emergencyPhone: EmergencyPhone;
  // paperSignatureInfo: PaperSignature
  // electronicSignatureInfo?: ElectronicSignature[]
  order: number;
  registered: boolean;
  modified: boolean;
  limitedEsign: boolean;
  canEsign: boolean;
  siteState: Locality;
  hasRegisteredEmanifestUser: boolean;
  gisPrimary: boolean;
}

interface Address {
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
