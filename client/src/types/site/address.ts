import { z } from 'zod';

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
  address1: z.string(),
  address2: z.string().optional(),
  city: z.string().optional(),
  country: rcraLocalitySchema.optional(),
  state: rcraLocalitySchema,
  streetNumber: z.string().optional(),
  zip: z.string().optional(),
});

/**
 * format of address information stored by EPA's RCRAInfo
 */
export type RcraAddress = z.infer<typeof rcraAddressSchema>;

/**
 * format of regional data including a code (e.g., TX) and name (e.g., Texas)
 * stored by EPA's RCRAInfo
 */
export type RcraLocality = z.infer<typeof rcraLocalitySchema>;
