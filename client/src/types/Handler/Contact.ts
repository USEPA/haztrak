/**
 * Contact information for a given handler listed on the hazardous waste manifest
 */
export interface Contact {
  firstName?: string;
  middleInitial?: string;
  lastName?: string;
  phone?: Phone;
  email?: string;
  companyName?: string;
}

/**
 * Phone object defined by RCRAInfo including Phone and optional extension
 */
export interface Phone {
  number: string;
  extension?: string;
}
