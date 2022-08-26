interface Manifest {
  manifestTrackingNumber?: string;
  createdDate?: string;
  updatedDate?: string;
  status?: string;
  submissionType?: string;
  originType?: string;
  import?: boolean;
  generator: Handler;
  designatedFacility: Handler;
}

interface Handler {
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

interface Locality {
  code: string;
  name?: string;
}

interface Contact {
  test: string;
}

export default Manifest;
