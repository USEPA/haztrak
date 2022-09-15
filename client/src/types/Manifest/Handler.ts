import { Contact } from './Contact';

export interface Handler {
  name: string;
  epaSiteId: string;
  gisPrimary: boolean;
  hasRegisteredEmanifestUser: boolean;
  mailingAddress: Address;
  siteAddress: Address;
  contact: Contact;
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
