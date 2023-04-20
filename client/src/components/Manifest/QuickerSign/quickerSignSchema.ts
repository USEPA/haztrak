import { z } from 'zod';

const siteType = z.enum(['Transporter', 'Generator', 'Tsdf', 'Broker']);
/**
 * The EPA Quicker Sign schema
 */
const quickerSignatureSchema = z.object({
  siteId: z.string(),
  siteType: siteType,
  transporterOrder: z.number().optional(),
  printedSignatureName: z.string(),
  printedSignatureDate: z.string(),
  manifestTrackingNumbers: z.string().array(),
});

const quickerSignDataSchema = z.object({
  handler: z.any(),
  siteType: z.enum(['Generator', 'Transporter', 'Tsdf']),
});

export type QuickerSignData = z.infer<typeof quickerSignDataSchema>;
export type QuickerSignature = z.infer<typeof quickerSignatureSchema>;
