import { z } from 'zod';

export const rcraPhoneSchema = z.object({
  // ToDo validate length and phone format/content separately
  number: z.string().min(12, 'Phone in {3}-{3}-{4} format Required'),
  extension: z.string().optional(),
});

export const rcraContactSchema = z.object({
  firstName: z.string().optional(),
  middleInitial: z.string().optional(),
  lastName: z.string().optional(),
  phone: rcraPhoneSchema.optional(),
  email: z.string().optional(),
  companyName: z.string().optional(),
});

/**
 * Locality Schema for EPA's Rcrainfo which contains information on a geographic region (state, country)
 * used for RCRA sites and handlers on a hazardous waste manifest
 */
// ToDo: rcraLocality code and name should be validated togather so codes correspond geographic regions
//  For example: if code === "TX" is true then name === "Texas" should also be true.
export const rcraLocalitySchema = z.object({
  code: z.string(),
  name: z.string().optional(),
});

/**
 * Address Schema  information for handlers on a hazardous waste manifest
 */
export const rcraAddressSchema = z.object({
  address1: z.string().min(3, { message: 'Required' }),
  address2: z.string().optional(),
  city: z.string().optional(),
  country: rcraLocalitySchema.optional(),
  state: rcraLocalitySchema,
  streetNumber: z.string().optional(),
  zip: z.string().optional(),
});
export const rcraSite = z.object({
  name: z.string(),
  /**
   * A RCRA Site ID number assigned by EPA to the address of the
   * physical location for a generator, transporter, or TSDF
   * that should be used on documents and forms submitted to EPA and states
   */
  epaSiteId: z.string().min(4, { message: "EPA ID should be 9 numbers and 3 letters or 'VSQG'" }),
  mailingAddress: rcraAddressSchema,
  /**
   * Represents the physical address of a facility regulated under RCRA, it should be tied to an EPA ID
   */
  siteAddress: rcraAddressSchema,
  /**
   * Contact information registered in RCRAInfo
   */
  contact: rcraContactSchema,
  /**
   * Emergency contact for incidents during transportation of the hazardous waste
   * ToDo: this should probably be on the Manifest Handler since it's manifest specific
   */
  emergencyPhone: rcraPhoneSchema,
  /**
   * Whether the handler has a registered user in RCRAInfo
   */
  registered: z.boolean().optional(),
  /**
   * Indicates if a site's information has been modified on a manifest
   * from what was on the handler’s notification form (a form used to
   * notify EPA of a site's hazardous waste activity)
   */
  modified: z.boolean().optional(),
  /**
   * Indicates there a registered user with 'preparer' level access associated with the handler
   * who can 'quick sign'.
   */
  limitedEsign: z.boolean().optional(),
  /**
   * Indicates there is a user associated with the site which can electronically sign
   */
  canEsign: z.boolean().optional(),
  /**
   * Indicates there is a RCRAInfo registered user associated with the site,
   * not necessarily a user who can electronically sign
   */
  hasRegisteredEmanifestUser: z.boolean().optional(),
  /**
   * Indicates if a site's address1 uses latitude/longitude
   */
  gisPrimary: z.boolean().optional(),
});

/**
 * The schema of an EPA Site as defined by the Resources Conservation and Recovery Act (RCRA).
 */
export type RcraSite = z.infer<typeof rcraSite>;

/**
 * format of address information stored by EPA's RCRAInfo
 */
export type RcraAddress = z.infer<typeof rcraAddressSchema>;

/**
 * format of regional data including a code (e.g., TX) and name (e.g., Texas)
 * stored by EPA's RCRAInfo
 */
export type RcraLocality = z.infer<typeof rcraLocalitySchema>;

/**
 * RCRA Phone schema defined by RCRAInfo including Phone and optional extension
 */
export type RcraPhone = z.infer<typeof rcraPhoneSchema>;

/**
 * Contact information for a given handler listed on the hazardous waste manifest
 */
export type RcraContact = z.infer<typeof rcraContactSchema>;
