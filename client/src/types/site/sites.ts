import { electronicSignatureSchema, paperSignatureSchema } from 'types/manifest/signatures';
import { rcraContactSchema, rcraPhoneSchema } from 'types/site/contact';
import { z } from 'zod';
import { rcraAddressSchema } from './address';

export const rcraSite = z.object({
  name: z.string(),
  /**
   * A RCRA Site ID number assigned by EPA to the address of the
   * physical location for a generator, transporter, or TSDF
   * that should be used on documents and forms submitted to EPA and states
   */
  epaSiteId: z.string(),
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

const handlerSchema = rcraSite.extend({
  paperSignatureInfo: paperSignatureSchema.optional(),
  electronicSignaturesInfo: electronicSignatureSchema.array().optional(),
  /**
   * Property on by back end to signify whether the handler has signed
   */
  signed: z.boolean().optional(),
});

/**
 * The Handler extends the RcraSite schema and adds manifest specific data
 */
export type Handler = z.infer<typeof handlerSchema>;

const transporterSchema = handlerSchema.extend({
  order: z.number(),
  manifest: z.number().optional(),
});

/**
 *  The Transporter type extends the Handler schema and adds transporter
 *  specific data, such as their order on the manifest
 */
export type Transporter = z.infer<typeof transporterSchema>;

const haztrakSiteSchema = z.object({
  name: z.string(),
  handler: rcraSite,
});

/**
 *  The Haztrak Site type encapsulates the RCRA site model as well as other details specific to
 *  that site. It is not directly associated with the EPA RCRAInfo system
 *  directly and can be extended as needed. For example, Haztrak users are given permission to
 *  haztrak sites, not RCRA sites.
 */
export type HaztrakSite = z.infer<typeof haztrakSiteSchema>;
