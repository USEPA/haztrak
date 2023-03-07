export interface Contact {
  firstName?: string;
  middleInitial?: string;
  lastName?: string;
  phone?: Phone;
  email?: string;
  companyName?: string;
}

export interface Phone {
  number: string;
  extension?: string;
}
