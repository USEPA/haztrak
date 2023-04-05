import { rcraLocalitySchema } from 'types/site/address';
import { z } from 'zod';

/**
 * Object containing info from a request for a correction from a RCRA authorized
 * state (e.g., Texas, California)
 */
const correctionRequestSchema = z.object({
  correctionRequestStatus: z.enum(['NotSend', 'Sent', 'IndustryResponded']),
  correctionRequestDate: z.string(),
  initiatorState: rcraLocalitySchema,
  active: z.boolean(),
  // stateUser
  // sections
});

export type CorrectionRequest = z.infer<typeof correctionRequestSchema>;
const partRole = z.enum(['Industry', 'State', 'Ppc', 'Epa']);

const correctionInfoSchema = z.object({
  versionNumber: z.number(),
  active: z.boolean(),
  ppcActive: z.boolean(),
  // electronicSignatureInfo
  // epaSiteId
  initiatorRole: partRole,
  updateRole: partRole,
});

export type CorrectionInfo = z.infer<typeof correctionInfoSchema>;
