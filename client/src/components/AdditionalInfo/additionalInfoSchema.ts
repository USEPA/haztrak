import { z } from 'zod';

/**
 * Comments which can be 'attached' to a handler EPA ID number
 */
export const additionalInfoCommentSchema = z.object({
  label: z.string().optional(),
  description: z.string().optional(),
  handlerId: z.string().optional(),
});

export const additionalInfoSchema = z.object({
  originalManifestTrackingNumbers: z.string().array().optional(),
  newManifestDestination: z.enum(['Tsdf', 'OriginalGenerator']).optional(),
  consentNumber: z.string().optional(),
  comments: additionalInfoCommentSchema.array().optional(),
});

export type AdditionalInfo = z.infer<typeof additionalInfoSchema>;
export type AdditionalInfoComment = z.infer<typeof additionalInfoCommentSchema>;
