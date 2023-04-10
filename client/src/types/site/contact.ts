import { z } from 'zod';

export const rcraPhoneSchema = z.object({
  number: z.string(),
  extension: z.string().optional(),
});

/**
 * RCRA Phone schema defined by RCRAInfo including Phone and optional extension
 */
export type RcraPhone = z.infer<typeof rcraPhoneSchema>;

export const rcraContactSchema = z.object({
  firstName: z.string().optional(),
  middleInitial: z.string().optional(),
  lastName: z.string().optional(),
  phone: rcraPhoneSchema.optional(),
  email: z.string().optional(),
  companyName: z.string().optional(),
});

/**
 * Contact information for a given handler listed on the hazardous waste manifest
 */
export type RcraContact = z.infer<typeof rcraContactSchema>;
