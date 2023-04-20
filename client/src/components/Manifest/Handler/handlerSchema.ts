import { rcraPhoneSchema, rcraSite } from 'components/RcraSite';
import { z } from 'zod';

export const paperSignatureSchema = z.object({
  printedName: z.string(),
  signatureDate: z.string(),
});

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

export const handlerSchema = rcraSite.extend({
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

/**
 * The Signature that appears on paper versions of the manifest
 */
export type PaperSignature = z.infer<typeof paperSignatureSchema>;

/**
 * A signer of a hazardous waste manifest
 */
export type Signer = z.infer<typeof signerSchema>;
/**
 * RCRAInfo electronic signature definition
 */
export type ElectronicSignature = z.infer<typeof electronicSignatureSchema>;
