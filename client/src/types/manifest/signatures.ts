import { rcraPhoneSchema } from 'types/site/contact';
import { z } from 'zod';

/**
 * The Signature that appears on paper versions of the manifest
 */
export const paperSignatureSchema = z.object({
  printedName: z.string(),
  signatureDate: z.string(),
});
export type PaperSignature = z.infer<typeof paperSignatureSchema>;

/**
 * Schema for signer of a hazardous waste manifest
 */
const signerSchema = z.object({
  /**
   * User's RCRAInfo username
   */
  userId: z.string().optional(),
  firstName: z.string().optional(),
  middleInitial: z.string().optional(),
  lastName: z.string().optional(),
  phone: rcraPhoneSchema.optional(),
  email: z.string().optional(),
  companyName: z.string().optional(),
  contactType: z.enum(['Email', 'Text', 'Voice']),
});

/**
 * A signer of a hazardous waste manifest
 */
export type Signer = z.infer<typeof signerSchema>;

/**
 * EPA's RCRAInfo electronic signature schema
 */
export const electronicSignatureSchema = z.object({
  signer: signerSchema.optional(),
  signatureDate: z.date().optional(),
  /**
   * Object representing metadata on a printable, human friendly, version of the manifest
   * ToDo: see the USEPA/e-Manifest documentation on GitHub
   */
  humanReadableDocument: z.any().optional(),
});

export type ElectronicSignature = z.infer<typeof electronicSignatureSchema>;
