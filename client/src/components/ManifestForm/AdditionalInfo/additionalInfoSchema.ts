import { z } from 'zod';

/**
 * Comments which can be 'attached' to a handler EPA ID number
 */
const additionalInfoCommentSchema = z.object({
  label: z.string().optional(),
  description: z.string().optional(),
  handlerId: z.string().optional(),
});

const additionalInfoSchema = z.object({
  originalManifestTrackingNumbers: z.string().array(),
  newManifestDestination: z.enum(['Tsdf', 'OriginalGenerator']),
  consentNumber: z.string(),
  comments: additionalInfoCommentSchema.array(),
});

export type AdditionalInfo = z.infer<typeof additionalInfoSchema>;
export type AdditionalInfoComment = z.infer<typeof additionalInfoCommentSchema>;
