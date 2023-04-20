import { z } from 'zod';
import { rcraSite } from 'components/RcraSite';

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
